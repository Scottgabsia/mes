export const CASE_LOOKUP_URL = "https://cryptorecoveryasset.com/case-lookup";
export const WHATSAPP_URL = "https://wa.me/message/FKM22PP45SVFO1";

export function buildClientCaseEmailText(
  clientName: string,
  caseId: string
): string {
  return [
    `Hello ${clientName},`,
    "",
    `Your case was received. Case ID: ${caseId}`,
    "",
    `Check case status: ${CASE_LOOKUP_URL}`,
    `WhatsApp support: ${WHATSAPP_URL}`,
    "",
    "Next steps:",
    "1. We validate your submission and assign an analyst.",
    "2. We trace asset movement and identify exchange touchpoints.",
    "3. We prepare evidence for compliance/KYC if required.",
    "4. You receive email updates as milestones are reached.",
    "",
    "© Crypto Recovery Asset All rights reserved.",
    "Private & Confidential • Forensic Intelligence Services",
  ].join("\n");
}

/** Email-client-safe HTML (no nested button tables; links on <td> anchors) */
export function buildClientCaseEmailHtml(
  clientName: string,
  caseId: string
): string {
  const safeName = escapeHtml(clientName);
  const safeId = escapeHtml(caseId);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Case received</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#0b1220;padding:24px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">Crypto Recovery Asset</p>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;">We received your case</p>
              <p style="margin:10px 0 0;font-family:Courier,monospace;font-size:13px;color:#93c5fd;">Case ID: <strong style="color:#bfdbfe;">${safeId}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;">
              <p style="margin:0 0 12px;">Hello <strong>${safeName}</strong>,</p>
              <p style="margin:0 0 12px;">Your request is registered in our recovery queue. Our team will review it and contact you at the email you provided.</p>
              <p style="margin:0 0 20px;color:#475569;">Keep your Case ID: <strong style="font-family:Courier,monospace;">${safeId}</strong></p>

              <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#0f172a;">Quick links</p>
              <p style="margin:0 0 16px;font-size:16px;">
                <a href="${CASE_LOOKUP_URL}" style="color:#2563eb;font-weight:bold;text-decoration:underline;">Open case status portal</a>
              </p>
              <p style="margin:0 0 24px;font-size:16px;">
                <a href="${WHATSAPP_URL}" style="color:#16a34a;font-weight:bold;text-decoration:underline;">Message us on WhatsApp</a>
              </p>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:12px;">
                <tr>
                  <td align="center" bgcolor="#2563eb" style="background-color:#2563eb;border-radius:10px;">
                    <a href="${CASE_LOOKUP_URL}" style="display:block;padding:16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Check Case Status</a>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;">
                <tr>
                  <td align="center" bgcolor="#16a34a" style="background-color:#16a34a;border-radius:10px;">
                    <a href="${WHATSAPP_URL}" style="display:block;padding:16px 20px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Chat on WhatsApp</a>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
                <tr>
                  <td style="padding:16px;font-size:13px;color:#334155;">
                    <p style="margin:0 0 10px;font-weight:bold;color:#0f172a;">Next steps in your recovery</p>
                    <p style="margin:0 0 8px;">• We validate your submission and assign an analyst.</p>
                    <p style="margin:0 0 8px;">• We trace asset movement and exchange touchpoints.</p>
                    <p style="margin:0 0 8px;">• We prepare compliance/KYC evidence if required.</p>
                    <p style="margin:0;">• You receive email updates at each milestone.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#94a3b8;">
              © Crypto Recovery Asset All rights reserved.<br/>
              Private &amp; Confidential • Forensic Intelligence Services
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
