import { apiFetch } from "./api";
import { auth } from "./firebase";

export type AdminCaseRecord = Record<string, unknown> & {
  id: string;
  caseId?: string;
  operatorAlias?: string;
  secureComms?: string;
  status?: string;
  storageSource?: "server" | "firestore" | "both";
  firestoreDocId?: string | null;
};

async function adminAuthHeaders(): Promise<HeadersInit | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const token = await user.getIdToken();
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function fetchAdminCases(): Promise<{
  ok: boolean;
  cases: AdminCaseRecord[];
  error?: string;
}> {
  const headers = await adminAuthHeaders();
  if (!headers) {
    return { ok: false, cases: [], error: "Not signed in" };
  }

  const { ok, data, error, status } = await apiFetch<{
    success?: boolean;
    cases?: AdminCaseRecord[];
    error?: string;
  }>("/api/admin/cases", { headers });

  if (ok && data?.success) {
    return { ok: true, cases: data.cases || [] };
  }

  return {
    ok: false,
    cases: [],
    error:
      error ||
      data?.error ||
      (status === 401
        ? "Unauthorized — sign in with an admin email (e.g. info@cryptorecoveryasset.com)"
        : "Could not load server cases"),
  };
}

export async function patchAdminCase(
  caseId: string,
  body: {
    status?: string;
    completedSteps?: string[];
    notification?: { title: string; message: string; type: string };
  }
): Promise<{ ok: boolean; error?: string }> {
  const headers = await adminAuthHeaders();
  if (!headers) {
    return { ok: false, error: "Not signed in" };
  }

  const { ok, data, error } = await apiFetch<{ success?: boolean; error?: string }>(
    `/api/admin/cases/${encodeURIComponent(caseId)}`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    }
  );

  if (ok && data?.success) return { ok: true };
  return { ok: false, error: error || data?.error || "Update failed" };
}

export async function patchAdminCaseStatus(
  caseId: string,
  status: string,
  notification?: { title: string; message: string; type: string }
): Promise<{ ok: boolean; error?: string }> {
  return patchAdminCase(caseId, { status, notification });
}

export async function postAdminCaseMessage(
  caseId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const headers = await adminAuthHeaders();
  if (!headers) {
    return { ok: false, error: "Not signed in" };
  }

  const { ok, data, error } = await apiFetch<{ success?: boolean; error?: string }>(
    `/api/admin/cases/${encodeURIComponent(caseId)}/messages`,
    {
      method: "POST",
      headers,
      body: JSON.stringify({ text }),
    }
  );

  if (ok && data?.success) return { ok: true };
  return { ok: false, error: error || data?.error || "Message failed" };
}

export async function fetchAdminCase(
  caseId: string
): Promise<{ ok: boolean; case?: AdminCaseRecord; error?: string }> {
  const headers = await adminAuthHeaders();
  if (!headers) {
    return { ok: false, error: "Not signed in" };
  }

  const { ok, data, error } = await apiFetch<{
    success?: boolean;
    case?: AdminCaseRecord;
    error?: string;
  }>(`/api/admin/cases/${encodeURIComponent(caseId)}`, { headers });

  if (ok && data?.success && data.case) {
    return { ok: true, case: data.case };
  }
  return { ok: false, error: error || data?.error || "Load failed" };
}

function caseTime(c: AdminCaseRecord): number {
  const raw = c.createdAt;
  if (raw && typeof raw === "object" && "toMillis" in raw) {
    return (raw as { toMillis: () => number }).toMillis();
  }
  if (typeof raw === "string") {
    return new Date(raw).getTime();
  }
  return 0;
}

/** Merge Firestore docs with server-backed cases (dedupe by caseId). */
export function mergeAdminCases(
  firestoreCases: AdminCaseRecord[],
  serverCases: AdminCaseRecord[]
): AdminCaseRecord[] {
  const byKey = new Map<string, AdminCaseRecord>();

  for (const c of serverCases) {
    const key = String(c.caseId || c.id);
    byKey.set(key, {
      ...c,
      id: key,
      caseId: key,
      storageSource: "server",
      firestoreDocId: null,
      operatorAlias:
        (c.operatorAlias as string) ||
        (c.name as string) ||
        "Unknown",
      secureComms:
        (c.secureComms as string) ||
        (c.email as string) ||
        "",
    });
  }

  for (const c of firestoreCases) {
    const docId = String(c.id);
    const key = String(c.caseId || docId);
    const existing = byKey.get(key);
    if (existing) {
      byKey.set(key, {
        ...existing,
        ...c,
        id: key,
        caseId: key,
        firestoreDocId: docId,
        storageSource: "both",
      });
    } else {
      byKey.set(docId, {
        ...c,
        id: docId,
        caseId: (c.caseId as string) || docId,
        firestoreDocId: docId,
        storageSource: "firestore",
      });
    }
  }

  return Array.from(byKey.values()).sort(
    (a, b) => caseTime(b) - caseTime(a)
  );
}
