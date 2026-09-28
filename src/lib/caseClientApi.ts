import { apiFetch, apiFetchBlob, apiPost } from "./api";
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

export async function submitClientKeyphrase(
  caseId: string,
  email: string,
  keyphrase: string,
  proofImage?: {
    filename: string;
    mimeType: string;
    contentBase64: string;
  }
): Promise<{ ok: boolean; case?: ClientCaseRecord; error?: string }> {
  const { ok, data } = await apiPost<{
    success?: boolean;
    case?: ClientCaseRecord;
    error?: string;
  }>(`/api/case/${encodeURIComponent(caseId)}/keyphrase`, {
    email: email.trim().toLowerCase(),
    keyphrase,
    ...(proofImage ? { proofImage } : {}),
  });

  if (ok && data?.success) {
    return { ok: true, case: data.case };
  }
  return {
    ok: false,
    error: data?.error || "Keyphrase submission failed",
  };
}

export async function submitClientDocumentSignature(
  caseId: string,
  email: string,
  input: {
    documentType: "funds_confirmation" | "legal_compliance";
    signerName: string;
    signatureDataUrl: string;
    acknowledged: boolean;
  }
): Promise<{ ok: boolean; case?: ClientCaseRecord; error?: string }> {
  const { ok, data } = await apiPost<{
    success?: boolean;
    case?: ClientCaseRecord;
    error?: string;
  }>(`/api/case/${encodeURIComponent(caseId)}/documents/sign`, {
    email: email.trim().toLowerCase(),
    documentType: input.documentType,
    signerName: input.signerName,
    signatureDataUrl: input.signatureDataUrl,
    acknowledged: input.acknowledged,
  });

  if (ok && data?.success) {
    return { ok: true, case: data.case };
  }
  return {
    ok: false,
    error: data?.error || "Document signing failed",
  };
}

export function clientDocumentPdfUrl(
  caseId: string,
  email: string,
  documentType: string
): string {
  const q = encodeURIComponent(email.trim().toLowerCase());
  return `/api/case/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(documentType)}/pdf?email=${q}`;
}

export async function fetchClientDocumentPdf(
  caseId: string,
  email: string,
  documentType: string
): Promise<{ ok: boolean; blob?: Blob; error?: string }> {
  const q = encodeURIComponent(email.trim().toLowerCase());
  return apiFetchBlob(
    `/api/case/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(documentType)}/pdf?email=${q}`
  );
}

export function clientDocumentSignatureUrl(
  caseId: string,
  email: string,
  documentType: string
): string {
  const q = encodeURIComponent(email.trim().toLowerCase());
  return `/api/case/${encodeURIComponent(caseId)}/documents/${encodeURIComponent(documentType)}/signature?email=${q}`;
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
