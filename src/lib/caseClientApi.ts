import { apiFetch, apiPost } from "./api";
import type { ClientCaseRecord } from "./caseLookupApi";

export async function fetchClientCase(
  caseId: string,
  email: string
): Promise<{ ok: boolean; case?: ClientCaseRecord; error?: string }> {
  const q = encodeURIComponent(email.trim().toLowerCase());
  const { ok, data, error } = await apiFetch<{
    success?: boolean;
    case?: ClientCaseRecord;
    error?: string;
  }>(`/api/case/${encodeURIComponent(caseId)}?email=${q}`);

  if (ok && data?.success && data.case) {
    return { ok: true, case: data.case };
  }
  return { ok: false, error: error || data?.error || "Could not load case" };
}

export async function postClientCaseMessage(
  caseId: string,
  email: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const { ok, data } = await apiPost<{ success?: boolean; error?: string }>(
    `/api/case/${encodeURIComponent(caseId)}/messages`,
    { email: email.trim().toLowerCase(), text }
  );

  if (ok && data?.success) return { ok: true };
  return { ok: false, error: data?.error || "Message failed" };
}

export async function markClientNotificationsRead(
  caseId: string,
  email: string,
  notificationId?: string
): Promise<void> {
  await apiFetch(`/api/case/${encodeURIComponent(caseId)}/notifications`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      notificationId,
    }),
  });
}
