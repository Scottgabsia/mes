export const SITE_URL = "https://cryptorecoveryasset.com";
export const CASE_LOOKUP_URL = `${SITE_URL}/case-lookup`;
export const CONTACT_EMAIL = "info@cryptorecoveryasset.com";
export const SUPPORT_PHONE_DISPLAY = "+1 (401) 684-4683";
/** Site support line — matches footer / structured data */
export const SUPPORT_PHONE_E164 = "14016844683";
export const BUSINESS_ADDRESS_LINE1 = "One World Trade Center, Suite 850";
export const BUSINESS_ADDRESS_LINE2 = "New York, NY 10007, USA";
export const BUSINESS_ADDRESS_INLINE = `${BUSINESS_ADDRESS_LINE1} · ${BUSINESS_ADDRESS_LINE2}`;
/** WhatsApp Business message link — used in case confirmation emails */
export const WHATSAPP_MESSAGE_URL = "https://wa.me/message/QYIWNLJV3ZHLE1";
export const BRAND_LOGO_URL = `${SITE_URL}/brand-icon-512.png`;

export function buildCaseLookupUrl(caseId: string): string {
  return `${CASE_LOOKUP_URL}?ref=${encodeURIComponent(caseId)}`;
}

export function buildWhatsAppUrl(_caseId?: string): string {
  return WHATSAPP_MESSAGE_URL;
}

export function buildClientCaseEmailText(
  clientName: string,
  caseId: string
): string {
  const lookupUrl = buildCaseLookupUrl(caseId);
  const whatsappUrl = buildWhatsAppUrl(caseId);

  return [
    "CRYPTO RECOVERY ASSET — CASE CONFIRMATION",
    "",
    `Hello ${clientName},`,
    "",
    "Thank you for trusting Crypto Recovery Asset. Your intake submission has been received and queued for forensic review.",
    "",
    `Case ID: ${caseId}`,
    `Status: PENDING — Intake review`,
    "",
    "WHAT HAPPENS NEXT",
    "1. Intake validation — our team verifies your submission details (typically within 24–48 hours).",
    "2. Analyst assignment — a lead forensic analyst is assigned to your file.",
    "3. Blockchain trace — we map fund movement and identify exchange or wallet touchpoints.",
    "4. Recovery action — we pursue recovery pathways and keep you updated at each milestone.",
    "",
    "YOUR SECURE CLIENT PORTAL",
    `Track status anytime: ${lookupUrl}`,
    `WhatsApp (mention your Case ID when you message us): ${whatsappUrl}`,
    "",
    "WHILE YOU WAIT",
    "• Save your Case ID in a secure place.",
    "• Gather transaction hashes, wallet addresses, and screenshots if you have them.",
    "• Watch for email from our team — we reply from official @cryptorecoveryasset.com addresses.",
    "• Do not share seed phrases or private keys with anyone except through our secure portal when requested.",
    "",
    "CONTACT",
    `Email: ${CONTACT_EMAIL}`,
    `Phone: ${SUPPORT_PHONE_DISPLAY}`,
    `Website: ${SITE_URL}`,
    BUSINESS_ADDRESS_LINE1,
    BUSINESS_ADDRESS_LINE2,
    "",
    "This message is private and confidential. Unauthorized disclosure is prohibited.",
    "",
    "© Crypto Recovery Asset. All rights reserved.",
    "Professional Forensic Analysis & Crypto Recovery Services",
  ].join("\n");
}

/**
 * Gmail/iOS: inline-block + padding — display:block breaks taps in Gmail.
 */
function emailCtaLink(
  href: string,
  label: string,
  bgColor: string,
  textColor = "#ffffff"
): string {
  return `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 12px;">
  <tr>
    <td align="center" style="padding:0;">
      <a href="${href}" target="_blank" rel="noopener noreferrer"
         style="background-color:${bgColor};border:2px solid ${bgColor};border-radius:12px;color:${textColor};display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:1.4;padding:18px 36px;text-align:center;text-decoration:none;min-width:300px;-webkit-text-size-adjust:none;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;
}

function timelineStep(num: string, title: string, detail: string): string {
  return `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 14px;">
  <tr>
    <td width="44" valign="top" style="padding:0 14px 0 0;">
      <div style="background-color:#2563eb;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;width:32px;height:32px;line-height:32px;text-align:center;border-radius:50%;">${num}</div>
    </td>
    <td valign="top" style="padding:0;">
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0f172a;">${escapeHtml(title)}</p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#64748b;">${escapeHtml(detail)}</p>
    </td>
  </tr>
</table>`;
}

/** Professional case confirmation — table layout, Gmail-safe CTAs */
export function buildClientCaseEmailHtml(
  clientName: string,
  caseId: string
): string {
  const safeName = escapeHtml(clientName);
  const safeId = escapeHtml(caseId);
  const lookupUrl = buildCaseLookupUrl(caseId);
  const whatsappUrl = buildWhatsAppUrl(caseId);
  const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Case ${caseId} — Client inquiry`)}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>Case ${safeId} — Confirmation</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;color-scheme:light only;">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef2f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #dbe3ef;border-radius:16px;">

          <!-- Brand header -->
          <tr>
            <td style="background-color:#0b1220;padding:28px 32px;border-radius:16px 16px 0 0;">
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td width="56" valign="middle" style="padding:0 16px 0 0;">
                    <img src="${BRAND_LOGO_URL}" width="48" height="48" alt="Crypto Recovery Asset" style="display:block;border:0;border-radius:10px;" />
                  </td>
                  <td valign="middle">
                    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:#ffffff;letter-spacing:-0.3px;">Crypto Recovery <span style="color:#3b82f6;">Asset</span></p>
                    <p style="margin:4px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#94a3b8;">Professional Forensic Analysis &amp; Recovery</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation banner -->
          <tr>
            <td style="background-color:#ecfdf5;border-bottom:1px solid #bbf7d0;padding:16px 32px;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#047857;letter-spacing:0.5px;text-transform:uppercase;">✓ Case registered successfully</p>
            </td>
          </tr>

          <!-- Main body -->
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#334155;">

              <p style="margin:0 0 8px;font-size:15px;color:#0f172a;">Hello <strong>${safeName}</strong>,</p>
              <p style="margin:0 0 24px;">Thank you for contacting <strong>Crypto Recovery Asset</strong>. Your intake submission is now in our secure recovery queue. A member of our forensic team will review your file and reach out using the email address you provided.</p>

              <!-- Case ID card -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="padding:0 0 8px;">
                          <p style="margin:0;font-size:11px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#64748b;">Your case reference</p>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="margin:0;font-family:Courier,monospace;font-size:22px;font-weight:bold;color:#1d4ed8;letter-spacing:0.5px;">${safeId}</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top:12px;">
                          <span style="display:inline-block;background-color:#fef3c7;color:#92400e;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:20px;letter-spacing:0.5px;text-transform:uppercase;">Status: Pending review</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Timeline -->
              <p style="margin:0 0 16px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#0f172a;">What happens next</p>

              ${timelineStep("1", "Intake validation", "We verify your submission and confirm all incident details are complete — typically within 24–48 business hours.")}
              ${timelineStep("2", "Analyst assignment", "A lead forensic analyst is assigned to your case and begins reviewing blockchain evidence.")}
              ${timelineStep("3", "Asset tracing", "We map fund movement across wallets, exchanges, and mixers to identify recovery pathways.")}
              ${timelineStep("4", "Recovery & updates", "We pursue actionable recovery steps and notify you by email at each major milestone.")}

              <!-- Portal section -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0 20px;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
                <tr>
                  <td style="padding:22px 24px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#1e40af;">Your secure client portal</p>
                    <p style="margin:0 0 18px;font-size:14px;line-height:1.6;color:#475569;">Track case status, receive analyst messages, and submit verification details through your private dashboard. Use the same email address you submitted on the intake form.</p>
                    ${emailCtaLink(lookupUrl, "Check Case Status", "#2563eb")}
                    ${emailCtaLink(whatsappUrl, "Chat on WhatsApp", "#16a34a")}
                  </td>
                </tr>
              </table>

              <!-- While you wait -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#0f172a;">While you wait — recommended actions</p>
                    <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#475569;">• Save your Case ID (<strong style="font-family:Courier,monospace;">${safeId}</strong>) in a secure location.</p>
                    <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#475569;">• Gather transaction hashes, wallet addresses, exchange records, and screenshots if available.</p>
                    <p style="margin:0 0 8px;font-size:13px;line-height:1.6;color:#475569;">• Watch for replies from <strong>info@cryptorecoveryasset.com</strong> — verify the sender before sharing sensitive data.</p>
                    <p style="margin:0;font-size:13px;line-height:1.6;color:#475569;">• Never share seed phrases or private keys except through our secure portal when explicitly requested by your assigned analyst.</p>
                  </td>
                </tr>
              </table>

              <!-- Contact -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;border-top:1px solid #e2e8f0;">
                <tr>
                  <td style="padding-top:24px;">
                    <p style="margin:0 0 12px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#0f172a;">Need immediate assistance?</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#475569;">Email: <a href="${mailtoUrl}" style="color:#2563eb;font-weight:bold;text-decoration:none;">${CONTACT_EMAIL}</a></p>
                    <p style="margin:0 0 6px;font-size:14px;color:#475569;">Phone: <a href="tel:+${SUPPORT_PHONE_E164}" style="color:#2563eb;font-weight:bold;text-decoration:none;">${SUPPORT_PHONE_DISPLAY}</a></p>
                    <p style="margin:0;font-size:14px;color:#475569;">Website: <a href="${SITE_URL}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;font-weight:bold;text-decoration:none;">cryptorecoveryasset.com</a></p>
                  </td>
                </tr>
              </table>

              <!-- Security notice -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:12px;line-height:1.55;color:#92400e;"><strong>Security notice:</strong> Crypto Recovery Asset will never ask for upfront payment via cryptocurrency, gift cards, or wire transfer to an unverified account. This message is private and confidential.</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
              <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#64748b;">Crypto Recovery Asset</p>
              <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#94a3b8;">${BUSINESS_ADDRESS_INLINE}</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.5;color:#94a3b8;">© ${new Date().getFullYear()} Crypto Recovery Asset. All rights reserved.<br/>Private &amp; Confidential · Forensic Intelligence Services</p>
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
export const WHATSAPP_URL = WHATSAPP_MESSAGE_URL;
