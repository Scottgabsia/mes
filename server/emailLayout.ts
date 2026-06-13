import {
  BRAND_LOGO_URL,
  BUSINESS_ADDRESS_INLINE,
  CONTACT_EMAIL,
  SITE_URL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_E164,
  WHATSAPP_MESSAGE_URL,
} from "./clientCaseEmail";

export { BRAND_LOGO_URL, CONTACT_EMAIL, SITE_URL, WHATSAPP_MESSAGE_URL };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Hidden preview text for inbox snippets (standard CSS only). */
export function emailPreheaderBlock(text: string): string {
  return `<div style="display:none;max-height:0;max-width:0;overflow:hidden;opacity:0;visibility:hidden;font-size:1px;line-height:1px;color:#eef2f7;">${escapeHtml(text)}</div>`;
}

/** Gmail/iOS-safe CTA — inline-block + padding */
export function emailCtaLink(
  href: string,
  label: string,
  bgColor: string,
  textColor = "#ffffff"
): string {
  return `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 12px;">
  <tr>
    <td align="center" style="padding:0;">
      <a href="${href}" target="_blank" rel="noopener noreferrer"
         style="background-color:${bgColor};border:2px solid ${bgColor};border-radius:12px;color:${textColor};display:inline-block;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;line-height:1.4;padding:18px 36px;text-align:center;text-decoration:none;min-width:280px;-webkit-text-size-adjust:none;">
        ${escapeHtml(label)}
      </a>
    </td>
  </tr>
</table>`;
}

export function emailBulletList(items: string[]): string {
  return items
    .map(
      (item) =>
        `<p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#475569;">• ${item}</p>`
    )
    .join("");
}

export function emailHighlightBox(
  title: string,
  bodyHtml: string,
  borderColor = "#bfdbfe",
  bgColor = "#eff6ff"
): string {
  return `<table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;background-color:${bgColor};border:1px solid ${borderColor};border-radius:12px;">
  <tr>
    <td style="padding:22px 24px;">
      <p style="margin:0 0 12px;font-size:13px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;color:#1e40af;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(title)}</p>
      ${bodyHtml}
    </td>
  </tr>
</table>`;
}

type BannerVariant = "success" | "info" | "neutral";

const BANNER_STYLES: Record<BannerVariant, { bg: string; border: string; color: string }> =
  {
    success: { bg: "#ecfdf5", border: "#bbf7d0", color: "#047857" },
    info: { bg: "#eff6ff", border: "#bfdbfe", color: "#1d4ed8" },
    neutral: { bg: "#f8fafc", border: "#e2e8f0", color: "#334155" },
  };

export function emailBanner(label: string, variant: BannerVariant = "info"): string {
  const s = BANNER_STYLES[variant];
  return `<tr>
    <td style="background-color:${s.bg};border-bottom:1px solid ${s.border};padding:16px 32px;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:${s.color};letter-spacing:0.5px;text-transform:uppercase;">${escapeHtml(label)}</p>
    </td>
  </tr>`;
}

export function emailBrandHeader(): string {
  return `<tr>
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
  </tr>`;
}

export function emailBrandFooter(unsubscribeUrl?: string): string {
  const unsub = unsubscribeUrl
    ? `<p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#94a3b8;"><a href="${escapeHtml(unsubscribeUrl)}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a> from marketing emails</p>`
    : "";

  return `<tr>
    <td align="center" style="padding:24px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;border-radius:0 0 16px 16px;">
      <p style="margin:0 0 6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;color:#64748b;">Crypto Recovery Asset</p>
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#94a3b8;">${BUSINESS_ADDRESS_INLINE}</p>
      <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.5;color:#94a3b8;">Email: <a href="mailto:${CONTACT_EMAIL}" style="color:#2563eb;text-decoration:none;">${CONTACT_EMAIL}</a> · Phone: <a href="tel:+${SUPPORT_PHONE_E164}" style="color:#2563eb;text-decoration:none;">${SUPPORT_PHONE_DISPLAY}</a></p>
      ${unsub}
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:1.5;color:#94a3b8;">© ${new Date().getFullYear()} Crypto Recovery Asset. All rights reserved.<br/>Private &amp; Confidential · Forensic Intelligence Services</p>
    </td>
  </tr>`;
}

export function wrapEmailDocument(options: {
  title: string;
  preheader?: string;
  banner?: { label: string; variant?: BannerVariant };
  bodyHtml: string;
  unsubscribeUrl?: string;
}): string {
  const preheader = options.preheader ? emailPreheaderBlock(options.preheader) : "";

  const banner = options.banner
    ? emailBanner(options.banner.label, options.banner.variant ?? "info")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light only" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(options.title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#eef2f7;color-scheme:light only;">
  ${preheader}
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#eef2f7;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table width="600" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;background-color:#ffffff;border:1px solid #dbe3ef;border-radius:16px;">
          ${emailBrandHeader()}
          ${banner}
          <tr>
            <td style="padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:#334155;">
              ${options.bodyHtml}
            </td>
          </tr>
          ${emailBrandFooter(options.unsubscribeUrl)}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function greetingName(firstName?: string): string {
  const trimmed = (firstName || "").trim();
  return trimmed ? escapeHtml(trimmed) : "there";
}
