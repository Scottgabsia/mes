export const CASE_LOOKUP_URL = "https://cryptorecoveryasset.com/case-lookup";
/** Site support line — matches footer / structured data */
export const SUPPORT_PHONE_E164 = "14016844683";

export function buildCaseLookupUrl(caseId: string): string {
  return `${CASE_LOOKUP_URL}?ref=${encodeURIComponent(caseId)}`;
}

export function buildWhatsAppUrl(caseId: string): string {
  const text = encodeURIComponent(
    `Hello, my case ID is ${caseId}. I need help with my crypto recovery case.`
  );
  return `https://wa.me/${SUPPORT_PHONE_E164}?text=${text}`;
}

export function buildClientCaseEmailText(
  clientName: string,
  caseId: string
): string {
  const lookupUrl = buildCaseLookupUrl(caseId);
  const whatsappUrl = buildWhatsAppUrl(caseId);

  return [
    `Hello ${clientName},`,
    "",
    `Your case was received. Case ID: ${caseId}`,
    "",
    `Check case status: ${lookupUrl}`,
    `WhatsApp support: ${whatsappUrl}`,
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

/**
 * Gmail/iOS: use inline-block + padding for size — display:block breaks taps in Gmail.
 */
function emailCtaLink(
  href: string,
  label: string,
  bgColor: string,
  textColor = "#ffffff"
): string {
  return `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 14px;">
  <tr>
    <td align="center" style="padding:0;">
      <a href="${href}" target="_blank" rel="noopener noreferrer"
         style="background-color:${bgColor};border:2px solid ${bgColor};border-radius:12px;color:${textColor};display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:bold;line-height:1.4;padding:20px 40px;text-align:center;text-decoration:none;min-width:300px;-webkit-text-size-adjust:none;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;
}

/** Email-client-safe HTML — tested pattern for Gmail mobile tap targets */
export function buildClientCaseEmailHtml(
  clientName: string,
  caseId: string
): string {
  const safeName = escapeHtml(clientName);
  const safeId = escapeHtml(caseId);
  const lookupUrl = buildCaseLookupUrl(caseId);
  const whatsappUrl = buildWhatsAppUrl(caseId);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>Case received</title>
  <style type="text/css">
    a { color: #2563eb; }
    .cta-link { text-decoration: none !important; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;color-scheme:light only;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f1f5f9;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #e2e8f0;border-radius:16px;">
          <tr>
            <td style="background-color:#0b1220;padding:24px;border-radius:16px 16px 0 0;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">Crypto Recovery Asset</p>
              <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;">We received your case</p>
              <p style="margin:10px 0 0;font-family:Courier,monospace;font-size:13px;color:#93c5fd;">Case ID: <strong style="color:#bfdbfe;">${safeId}</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#0f172a;">
              <p style="margin:0 0 12px;">Hello <strong>${safeName}</strong>,</p>
              <p style="margin:0 0 12px;">Your request is registered in our recovery queue. Our team will review it and contact you at the email you provided.</p>
              <p style="margin:0 0 24px;color:#475569;">Keep your Case ID: <strong style="font-family:Courier,monospace;">${safeId}</strong></p>

              <p style="margin:0 0 16px;font-size:14px;font-weight:bold;color:#0f172a;text-align:center;">Quick actions</p>

              ${emailCtaLink(lookupUrl, "Check Case Status", "#2563eb")}

              ${emailCtaLink(whatsappUrl, "Chat on WhatsApp", "#16a34a")}

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:10px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
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
            <td align="center" style="padding:18px 24px;background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#94a3b8;">
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

/** @deprecated Use buildWhatsAppUrl(caseId) — kept for imports that expect a constant */
export const WHATSAPP_URL = `https://wa.me/${SUPPORT_PHONE_E164}`;
