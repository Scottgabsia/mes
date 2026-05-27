import {
  cleanEnvVar,
  dispatchEmail,
  generateCaseId,
  getEmailConfig,
  isEmailConfigured,
} from "./email";

export const MAX_INTEGRITY_UPLOAD_BYTES = 5 * 1024 * 1024;

export function getForensicPgpPublicKey(): string | null {
  const key = cleanEnvVar(process.env.FORENSIC_PGP_PUBLIC_KEY);
  return key || null;
}

export async function sendIntegrityVerifierEmail(payload: {
  filename: string;
  sha256: string;
  fileSize: number;
  mimeType: string;
  fileBuffer: Buffer;
  notifierEmail?: string;
}) {
  const { ADMIN_EMAIL } = getEmailConfig();
  const caseRef = generateCaseId();
  const submittedAt = new Date().toLocaleString();

  await dispatchEmail({
    to: ADMIN_EMAIL,
    replyTo: payload.notifierEmail || undefined,
    subject: `[Integrity Verifier] ${payload.filename} — ${caseRef}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #059669;">Forensic file received — ${caseRef}</h2>
        <p><strong>Submitted:</strong> ${submittedAt}</p>
        <p><strong>Original filename:</strong> ${escapeHtml(payload.filename)}</p>
        <p><strong>SHA-256:</strong> <code>${escapeHtml(payload.sha256)}</code></p>
        <p><strong>Size:</strong> ${payload.fileSize.toLocaleString()} bytes</p>
        <p><strong>MIME:</strong> ${escapeHtml(payload.mimeType)}</p>
        ${
          payload.notifierEmail
            ? `<p><strong>Notifier email:</strong> ${escapeHtml(payload.notifierEmail)}</p>`
            : ""
        }
        <p style="margin-top: 16px;">The file is attached to this message.</p>
      </div>
    `,
    text: [
      `Integrity Verifier — ${caseRef}`,
      `File: ${payload.filename}`,
      `SHA-256: ${payload.sha256}`,
      `Size: ${payload.fileSize} bytes`,
      payload.notifierEmail ? `From: ${payload.notifierEmail}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
    attachments: [
      {
        filename: payload.filename.replace(/[^\w.\-]+/g, "_") || "forensic-upload.bin",
        content: payload.fileBuffer,
        contentType: payload.mimeType || "application/octet-stream",
      },
    ],
  });

  return { caseRef, emailSent: true };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export { isEmailConfigured };
