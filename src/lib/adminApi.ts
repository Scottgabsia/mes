import { apiUrl } from "./api";
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

  try {
    const res = await fetch(apiUrl("/api/admin/cases"), { headers });
    const data = (await res.json()) as {
      success?: boolean;
      cases?: AdminCaseRecord[];
      error?: string;
    };
    if (!res.ok || !data.success) {
      return {
        ok: false,
        cases: [],
        error: data.error || `HTTP ${res.status}`,
      };
    }
    return { ok: true, cases: data.cases || [] };
  } catch (err) {
    return {
      ok: false,
      cases: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

export async function patchAdminCaseStatus(
  caseId: string,
  status: string
): Promise<{ ok: boolean; error?: string }> {
  const headers = await adminAuthHeaders();
  if (!headers) {
    return { ok: false, error: "Not signed in" };
  }

  try {
    const res = await fetch(apiUrl(`/api/admin/cases/${encodeURIComponent(caseId)}`), {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status }),
    });
    const data = (await res.json()) as { success?: boolean; error?: string };
    if (!res.ok || !data.success) {
      return { ok: false, error: data.error || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
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
