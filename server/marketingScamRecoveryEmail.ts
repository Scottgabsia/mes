import {
  BRAND_LOGO_URL,
  BUSINESS_ADDRESS_LINE1,
  BUSINESS_ADDRESS_LINE2,
  CONTACT_EMAIL,
  SITE_URL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_E164,
  WHATSAPP_MESSAGE_URL,
} from "./clientCaseEmail";
import { emailCtaLink, emailPreheaderBlock } from "./emailLayout";

const RECOVERY_INTAKE_URL = `${SITE_URL}/contact`;

/** Alternate subject lines for A/B tests or manual sends */
export const SCAM_RECOVERY_SUBJECT_LINES = [
  "Don't Fall for Crypto Withdrawal Scams",
  "Trace & Recover Stolen Crypto Safely",
  "Protect Your Digital Assets Today",
] as const;

export const SCAM_RECOVERY_DEFAULT_SUBJECT = SCAM_RECOVERY_SUBJECT_LINES[1];

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailCompactButtonAnchor(
  href: string,
  label: string,
  bgColor: string,
  textColor = "#ffffff",
  borderColor?: string
): string {
  const border = borderColor || bgColor;
  return `<a href="${href}" target="_blank" rel="noopener noreferrer"
       style="background-color:${bgColor};border:1px solid ${border};border-radius:8px;color:${textColor};display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;line-height:1.3;padding:12px 18px;text-align:center;text-decoration:none;min-width:120px;-webkit-text-size-adjust:none;">
      ${escapeHtml(label)}
    </a>`;
}

function emailCompactButton(
  href: string,
  label: string,
  bgColor: string,
  textColor = "#ffffff",
  borderColor?: string
): string {
  return `<td align="center" style="padding:6px;">${emailCompactButtonAnchor(href, label, bgColor, textColor, borderColor)}</td>`;
}

/** Light blue/white header with shield + lock trust badges */
function emailTrustHeroHeader(): string {
  return `<tr>
    <td style="background-color:#f0f7ff;padding:32px 28px 28px;border-radius:16px 16px 0 0;border-bottom:1px solid #dbeafe;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding-bottom:20px;">
            <table border="0" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td align="center" style="width:56px;height:56px;background-color:#2563eb;border-radius:50%;font-size:26px;line-height:56px;text-align:center;vertical-align:middle;" title="Protected">🛡️</td>
                <td style="width:12px;font-size:1px;line-height:1px;">&nbsp;</td>
                <td align="center" style="width:56px;height:56px;background-color:#ffffff;border:2px solid #93c5fd;border-radius:50%;font-size:26px;line-height:52px;text-align:center;vertical-align:middle;" title="Secure">🔒</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding-bottom:12px;">
            <img src="${BRAND_LOGO_URL}" width="44" height="44" alt="Crypto Recovery Asset" style="display:block;border:0;border-radius:10px;margin:0 auto;" />
          </td>
        </tr>
        <tr>
          <td align="center">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:17px;font-weight:bold;color:#1e3a8a;letter-spacing:-0.2px;">Crypto Recovery <span style="color:#2563eb;">Asset</span></p>
            <p style="margin:6px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#64748b;">Trusted Forensic Recovery · Law-Enforcement Aligned</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function emailTrustMarketingFooter(unsubscribeUrl?: string): string {
  const unsub = unsubscribeUrl
    ? `<p style="margin:12px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:#94a3b8;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a></p>`
    : "";

  return `<tr>
    <td align="center" style="padding:28px 24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#1e40af;">Crypto Recovery Asset</p>
      <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.5px;color:#64748b;">Trusted &nbsp;•&nbsp; Professional &nbsp;•&nbsp; Secure</p>

      <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
        <tr>
          ${emailCompactButton(WHATSAPP_MESSAGE_URL, "WhatsApp", "#16a34a")}
          ${emailCompactButton(SITE_URL, "Website", "#2563eb")}
        </tr>
        <tr>
          <td colspan="2" align="center" style="padding:6px;">
            ${emailCompactButtonAnchor(`mailto:${CONTACT_EMAIL}`, "Contact Email", "#ffffff", "#1e40af", "#93c5fd")}
          </td>
        </tr>
      </table>

      <p style="margin:20px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.5;color:#94a3b8;">
        <a href="mailto:${CONTACT_EMAIL}" style="color:#2563eb;text-decoration:none;">${CONTACT_EMAIL}</a>
        &nbsp;·&nbsp;
        <a href="tel:+${SUPPORT_PHONE_E164}" style="color:#2563eb;text-decoration:none;">${SUPPORT_PHONE_DISPLAY}</a>
      </p>
      <p style="margin:10px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.55;color:#94a3b8;">
        ${BUSINESS_ADDRESS_LINE1}<br/>${BUSINESS_ADDRESS_LINE2}
      </p>
      <p style="margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.5;color:#cbd5e1;">© ${new Date().getFullYear()} Crypto Recovery Asset. All rights reserved.</p>
      ${unsub}
    </td>
  </tr>`;
}

function scamBullet(title: string, detail: string): string {
  return `<tr>
    <td style="padding:0 0 14px;">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;">
        <tr>
          <td style="padding:14px 16px;">
            <p style="margin:0 0 4px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:#0f172a;">${escapeHtml(title)}</p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.55;color:#64748b;">${escapeHtml(detail)}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

export function buildScamRecoveryCampaignHtml(
  vars: { firstName?: string; unsubscribeUrl?: string } = {}
): string {
  const name = (vars.firstName || "").trim();
  const greeting = name ? escapeHtml(name) : "there";
  const preheader =
    "Withdrawal fee scams, fake platforms, phishing, and Ponzi schemes — we help victims trace funds with forensic experts and law enforcement.";

  const bodyHtml = `
    <p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#475569;">Hello <strong style="color:#0f172a;">${greeting}</strong>,</p>

    <h1 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;line-height:1.25;color:#0f172a;letter-spacing:-0.5px;">
      We Help Victims of Crypto Scams Recover Their Funds
    </h1>

    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#475569;">
      Every day, people lose money to scams like:
    </p>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
      ${scamBullet(
        "Withdrawal fee scams",
        "Platforms demand “extra fees” before releasing funds — then disappear."
      )}
      ${scamBullet(
        "Fake investment platforms",
        "Promising high returns, then blocking withdrawals when you try to cash out."
      )}
      ${scamBullet(
        "Phishing & hacked wallets",
        "Tricking victims into giving up private keys or signing malicious transactions."
      )}
      ${scamBullet(
        "Ponzi & pyramid schemes",
        "Endless deposits with no real payout — until the scheme collapses."
      )}
    </table>

    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 28px;background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;">
      <tr>
        <td style="padding:22px 24px;">
          <table border="0" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td valign="top" style="padding-right:12px;font-size:22px;line-height:1;">⚖️</td>
              <td valign="top">
                <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#334155;">
                  At <strong>Crypto Recovery Asset</strong>, we understand how devastating this can be. That is why we work with <strong>blockchain forensic experts</strong> and coordinate with <strong>law enforcement</strong> where appropriate — to trace stolen funds and support victims in building strong, evidence-backed cases.
                </p>
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.65;color:#1e40af;font-weight:bold;">
                  You do not have to face this alone — we are here to help you take action.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    ${emailCtaLink(RECOVERY_INTAKE_URL, "Start Your Recovery Journey", "#2563eb")}

    <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
      <tr>
        <td style="padding:14px 18px;">
          <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.55;color:#92400e;">
            <strong>Security note:</strong> We never ask for upfront crypto payments or your seed phrase by email. Official messages come from <strong>@cryptorecoveryasset.com</strong>.
          </p>
        </td>
      </tr>
    </table>`;

  const preheaderBlock = emailPreheaderBlock(preheader);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>Crypto scam recovery — Crypto Recovery Asset</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;font-family:Arial,Helvetica,sans-serif;color-scheme:light only;">
  ${preheaderBlock}
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef2f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #dbe3ef;border-radius:16px;box-shadow:0 4px 24px rgba(37,99,235,0.06);">
          ${emailTrustHeroHeader()}
          <tr>
            <td style="padding:32px 28px 8px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#334155;">
              ${bodyHtml}
            </td>
          </tr>
          ${emailTrustMarketingFooter(vars.unsubscribeUrl)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildScamRecoveryCampaignText(
  vars: { firstName?: string } = {}
): string {
  const name = (vars.firstName || "").trim() || "there";
  return [
    "CRYPTO RECOVERY ASSET",
    "Trusted • Professional • Secure",
    "",
    `Hello ${name},`,
    "",
    "WE HELP VICTIMS OF CRYPTO SCAMS RECOVER THEIR FUNDS",
    "",
    "Every day, people lose money to scams like:",
    "• Withdrawal fee scams — extra fees demanded before releasing funds.",
    "• Fake investment platforms — high returns promised, withdrawals blocked.",
    "• Phishing & hacked wallets — private keys stolen.",
    "• Ponzi & pyramid schemes — deposits with no real payout.",
    "",
    "At Crypto Recovery Asset, we work with blockchain forensic experts and coordinate with law enforcement where appropriate to trace stolen funds and support victims in building strong cases.",
    "",
    "You do not have to face this alone — we are here to help you take action.",
    "",
    `Start your recovery: ${RECOVERY_INTAKE_URL}`,
    `WhatsApp: ${WHATSAPP_MESSAGE_URL}`,
    `Website: ${SITE_URL}`,
    `Email: ${CONTACT_EMAIL}`,
    `Phone: ${SUPPORT_PHONE_DISPLAY}`,
    `${BUSINESS_ADDRESS_LINE1}`,
    `${BUSINESS_ADDRESS_LINE2}`,
    "",
    "© Crypto Recovery Asset. All rights reserved.",
  ].join("\n");
}
