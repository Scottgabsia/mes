import { buildCaseLookupUrl } from "./clientCaseEmail";
import {
  emailCtaLink,
  emailHighlightBox,
  greetingName,
  wrapEmailDocument,
} from "./emailLayout";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function truncate(text: string, max = 120): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

function messageQuoteBlock(label: string, messageText: string): string {
  const safe = escapeHtml(messageText);
  return `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;background-color:#f8fafc;border-left:4px solid #2563eb;border-radius:0 12px 12px 0;">
  <tr>
    <td style="padding:22px 24px;">
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#64748b;">${escapeHtml(label)}</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#334155;white-space:pre-wrap;">${safe}</p>
    </td>
  </tr>
</table>`;
}

function caseMetaBlock(caseId: string, status: string, clientEmail?: string): string {
  const rows = [
    `<tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Case ID</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:#0f172a;text-align:right;">${escapeHtml(caseId)}</td></tr>`,
    `<tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Status</td><td style="padding:4px 0;font-size:13px;font-weight:bold;color:#1d4ed8;text-align:right;">${escapeHtml(status)}</td></tr>`,
  ];
  if (clientEmail) {
    rows.push(
      `<tr><td style="padding:4px 0;font-size:13px;color:#64748b;">Client email</td><td style="padding:4px 0;font-size:13px;color:#2563eb;text-align:right;"><a href="mailto:${escapeHtml(clientEmail)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(clientEmail)}</a></td></tr>`
    );
  }
  return `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
  ${rows.join("")}
</table>`;
}

/** Email sent to client when admin posts a message in the case manager. */
export function buildAdminMessageClientEmailHtml(options: {
  clientName: string;
  caseId: string;
  status: string;
  messageText: string;
}): string {
  const portalUrl = buildCaseLookupUrl(options.caseId);
  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:#0f172a;">Hello <strong>${greetingName(options.clientName)}</strong>,</p>
    <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#475569;">
      Your assigned <strong>private law forensic investigator</strong> has sent you a secure update on your recovery case. Please review the message below and sign in to your client portal to reply and track progress.
    </p>
    ${messageQuoteBlock("Message from your forensic investigator", options.messageText)}
    ${emailHighlightBox(
      "Your case",
      caseMetaBlock(options.caseId, options.status),
      "#bfdbfe",
      "#eff6ff"
    )}
    <p style="margin:0 0 8px;font-size:15px;line-height:1.65;color:#475569;">
      Open your private dashboard to view your full case timeline, respond securely, and communicate directly with your investigator.
    </p>
    ${emailCtaLink(portalUrl, "Check case status & reply", "#2563eb")}
    <p style="margin:0;font-size:12px;line-height:1.55;color:#94a3b8;text-align:center;">
      Use the same email address you submitted on your intake form to access your portal.
    </p>`;

  return wrapEmailDocument({
    title: `New case message — ${options.caseId}`,
    preheader: truncate(options.messageText),
    banner: { label: "Secure case communication", variant: "info" },
    bodyHtml,
  });
}

export function buildAdminMessageClientEmailText(options: {
  clientName: string;
  caseId: string;
  status: string;
  messageText: string;
}): string {
  const portalUrl = buildCaseLookupUrl(options.caseId);
  return [
    "CRYPTO RECOVERY ASSET — NEW CASE MESSAGE",
    "",
    `Hello ${options.clientName || "there"},`,
    "",
    "Your assigned private law forensic investigator has sent you a secure update on your recovery case.",
    "",
    `Case ID: ${options.caseId}`,
    `Status: ${options.status}`,
    "",
    "MESSAGE:",
    options.messageText,
    "",
    "Check your case status and reply through your private client portal:",
    portalUrl,
    "",
    "Use the same email address you submitted on your intake form.",
    "",
    "This message is private and confidential.",
  ].join("\n");
}

/** Email sent to admin when a client posts a message from the portal. */
export function buildClientMessageAdminEmailHtml(options: {
  clientName: string;
  clientEmail: string;
  caseId: string;
  status: string;
  messageText: string;
}): string {
  const bodyHtml = `
    <p style="margin:0 0 18px;font-size:15px;line-height:1.65;color:#475569;">
      A client replied through the secure recovery portal. Review the message below and respond from the admin case manager.
    </p>
    ${emailHighlightBox(
      "Case details",
      caseMetaBlock(options.caseId, options.status, options.clientEmail),
      "#e2e8f0",
      "#f8fafc"
    )}
    ${messageQuoteBlock(`Message from ${options.clientName}`, options.messageText)}
    <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#475569;">
      Reply directly from the admin panel to continue the secure thread with your client.
    </p>
    <p style="margin:0;font-size:12px;line-height:1.55;color:#94a3b8;">
      You can reply to this email to reach the client at <a href="mailto:${escapeHtml(options.clientEmail)}" style="color:#2563eb;text-decoration:none;">${escapeHtml(options.clientEmail)}</a>.
    </p>`;

  return wrapEmailDocument({
    title: `Client message — ${options.caseId}`,
    preheader: truncate(`${options.clientName}: ${options.messageText}`),
    banner: { label: "New client portal message", variant: "neutral" },
    bodyHtml,
  });
}

export function buildClientMessageAdminEmailText(options: {
  clientName: string;
  clientEmail: string;
  caseId: string;
  status: string;
  messageText: string;
}): string {
  return [
    "CLIENT PORTAL MESSAGE",
    "",
    `Case ID: ${options.caseId}`,
    `Status: ${options.status}`,
    `Client: ${options.clientName}`,
    `Email: ${options.clientEmail}`,
    "",
    "MESSAGE:",
    options.messageText,
    "",
    "Reply from the admin case manager or by email to the client address above.",
  ].join("\n");
}
