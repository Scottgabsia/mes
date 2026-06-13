import {
  CASE_LOOKUP_URL,
  CONTACT_EMAIL,
  SITE_URL,
  WHATSAPP_MESSAGE_URL,
} from "./clientCaseEmail";
import {
  emailBulletList,
  emailCtaLink,
  emailHighlightBox,
  greetingName,
  wrapEmailDocument,
} from "./emailLayout";

import {
  buildScamRecoveryCampaignHtml,
  buildScamRecoveryCampaignText,
  SCAM_RECOVERY_DEFAULT_SUBJECT,
} from "./marketingScamRecoveryEmail";

export type MarketingTemplateId =
  | "scam_recovery_campaign"
  | "nurture_72_hour"
  | "trust_social_proof"
  | "educational_red_flags"
  | "re_engagement";

export interface MarketingEmailVars {
  /** Recipient first name — falls back to "there" */
  firstName?: string;
  /** Optional case reference for personalized CTAs */
  caseId?: string;
  /** Link for unsubscribe (required for bulk marketing sends) */
  unsubscribeUrl?: string;
}

export interface MarketingEmailTemplate {
  id: MarketingTemplateId;
  name: string;
  description: string;
  subject: (vars: MarketingEmailVars) => string;
  preheader: string;
  buildHtml: (vars: MarketingEmailVars) => string;
  buildText: (vars: MarketingEmailVars) => string;
}

function portalUrl(caseId?: string): string {
  if (!caseId) return CASE_LOOKUP_URL;
  return `${CASE_LOOKUP_URL}?ref=${encodeURIComponent(caseId)}`;
}

function safeCaseId(caseId?: string): string {
  if (!caseId) return "";
  return caseId
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const scamRecoveryCampaign: MarketingEmailTemplate = {
  id: "scam_recovery_campaign",
  name: "Scam recovery campaign (flagship)",
  description:
    "Primary marketing email — common scams, law enforcement cooperation, recovery CTA. Calm blue/white trust design.",
  subject: () => SCAM_RECOVERY_DEFAULT_SUBJECT,
  preheader:
    "Withdrawal scams, fake platforms, phishing, Ponzi schemes — forensic tracing and law-enforcement support for victims.",
  buildHtml(vars) {
    return buildScamRecoveryCampaignHtml(vars);
  },
  buildText(vars) {
    return buildScamRecoveryCampaignText(vars);
  },
};

const nurture72Hour: MarketingEmailTemplate = {
  id: "nurture_72_hour",
  name: "72-hour action guide",
  description:
    "Sent after intake or to leads — explains critical steps in the first 72 hours after a crypto scam.",
  subject: () =>
    "The first 72 hours matter — your crypto recovery action guide",
  preheader:
    "Three steps that protect evidence and improve recovery odds after a scam.",
  buildHtml(vars) {
    const name = greetingName(vars.firstName);
    const portal = portalUrl(vars.caseId);

    const body = `
      <p style="margin:0 0 8px;font-size:15px;color:#0f172a;">Hello <strong>${name}</strong>,</p>
      <p style="margin:0 0 24px;">If you have been targeted by a crypto scam, the <strong>first 72 hours</strong> are critical. What you do now can preserve blockchain evidence and strengthen any recovery pathway our forensic team pursues.</p>

      ${emailHighlightBox(
        "Step 1 — Stop & document",
        emailBulletList([
          "Do not send more funds — scammers often request a second “release fee.”",
          "Screenshot wallet apps, exchange dashboards, and chat logs with timestamps.",
          "Copy every transaction hash (TXID) involved in the incident.",
        ])
      )}

      ${emailHighlightBox(
        "Step 2 — Secure your accounts",
        emailBulletList([
          "Change passwords and enable 2FA on email and exchange accounts.",
          "Revoke unknown API keys and connected wallet approvals (token allowances).",
          "Never share seed phrases — legitimate recovery firms never ask for them upfront.",
        ]),
        "#bbf7d0",
        "#ecfdf5"
      )}

      ${emailHighlightBox(
        "Step 3 — Engage forensic recovery",
        `<p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:#475569;">Our analysts map fund flows across wallets, mixers, and exchanges. The sooner we receive complete incident metadata, the faster we can triage your file.</p>
         ${emailCtaLink(portal, vars.caseId ? "Open your case portal" : "Start or track your case", "#2563eb")}
         ${emailCtaLink(WHATSAPP_MESSAGE_URL, "Chat on WhatsApp", "#16a34a")}`,
        "#e9d5ff",
        "#faf5ff"
      )}

      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:#fffbeb;border:1px solid #fde68a;border-radius:10px;">
        <tr>
          <td style="padding:14px 18px;">
            <p style="margin:0;font-size:12px;line-height:1.55;color:#92400e;"><strong>Reminder:</strong> Crypto Recovery Asset operates on a success-contingency model — we do not request upfront crypto payments or gift cards. Official communication comes from <strong>@cryptorecoveryasset.com</strong>.</p>
          </td>
        </tr>
      </table>`;

    return wrapEmailDocument({
      title: "72-hour action guide",
      preheader: nurture72Hour.preheader,
      banner: { label: "Recovery intelligence briefing", variant: "info" },
      bodyHtml: body,
      unsubscribeUrl: vars.unsubscribeUrl,
    });
  },
  buildText(vars) {
    const name = (vars.firstName || "").trim() || "there";
    return [
      "CRYPTO RECOVERY ASSET — 72-HOUR ACTION GUIDE",
      "",
      `Hello ${name},`,
      "",
      "The first 72 hours after a crypto scam are critical. Follow these steps:",
      "",
      "STEP 1 — STOP & DOCUMENT",
      "• Do not send more funds.",
      "• Screenshot wallets, exchanges, and chat logs.",
      "• Save every transaction hash (TXID).",
      "",
      "STEP 2 — SECURE ACCOUNTS",
      "• Change passwords; enable 2FA.",
      "• Revoke suspicious API keys and token approvals.",
      "• Never share seed phrases with unverified contacts.",
      "",
      "STEP 3 — ENGAGE FORENSIC RECOVERY",
      `Portal: ${portalUrl(vars.caseId)}`,
      `WhatsApp: ${WHATSAPP_MESSAGE_URL}`,
      "",
      `Website: ${SITE_URL}`,
      "",
      vars.unsubscribeUrl ? `Unsubscribe: ${vars.unsubscribeUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
};

const trustSocialProof: MarketingEmailTemplate = {
  id: "trust_social_proof",
  name: "Trust & social proof",
  description:
    "Builds credibility — success rate, process transparency, and link to verified reviews.",
  subject: () => "Why victims choose Crypto Recovery Asset for forensic recovery",
  preheader:
    "94.2% documented success rate · Zero upfront fees · Global exchange coordination.",
  buildHtml(vars) {
    const name = greetingName(vars.firstName);
    const reviewsUrl = `${SITE_URL}/reviews`;

    const body = `
      <p style="margin:0 0 8px;font-size:15px;color:#0f172a;">Hello <strong>${name}</strong>,</p>
      <p style="margin:0 0 24px;">Recovering stolen digital assets requires more than hope — it requires <strong>forensic-grade blockchain analysis</strong>, exchange coordination, and a team that has done this at scale.</p>

      <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
        <tr>
          <td width="33%" align="center" style="padding:12px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:10px 0 0 10px;">
            <p style="margin:0;font-size:22px;font-weight:bold;color:#2563eb;">94.2%</p>
            <p style="margin:4px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Success rate</p>
          </td>
          <td width="34%" align="center" style="padding:12px;background-color:#f8fafc;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
            <p style="margin:0;font-size:22px;font-weight:bold;color:#2563eb;">$0</p>
            <p style="margin:4px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Upfront fees</p>
          </td>
          <td width="33%" align="center" style="padding:12px;background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:0 10px 10px 0;">
            <p style="margin:0;font-size:22px;font-weight:bold;color:#2563eb;">24/7</p>
            <p style="margin:4px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:1px;color:#64748b;">Case monitoring</p>
          </td>
        </tr>
      </table>

      <p style="margin:0 0 16px;font-size:14px;line-height:1.65;color:#475569;">We trace funds across Bitcoin, Ethereum, stablecoins, and DeFi protocols — then work with compliant exchanges and law-enforcement partners where appropriate. Our fee is tied to <strong>successful recovery</strong>, not empty promises.</p>

      ${emailCtaLink(reviewsUrl, "Read verified client reviews", "#2563eb")}
      ${emailCtaLink(portalUrl(vars.caseId), "Access your case portal", "#0f172a", "#ffffff")}
      ${emailCtaLink(WHATSAPP_MESSAGE_URL, "Chat on WhatsApp", "#16a34a")}`;

    return wrapEmailDocument({
      title: "Why victims choose us",
      preheader: trustSocialProof.preheader,
      banner: { label: "Trusted forensic recovery", variant: "success" },
      bodyHtml: body,
      unsubscribeUrl: vars.unsubscribeUrl,
    });
  },
  buildText(vars) {
    const name = (vars.firstName || "").trim() || "there";
    return [
      `Hello ${name},`,
      "",
      "Crypto Recovery Asset — forensic blockchain recovery with zero upfront fees.",
      "• 94.2% documented success rate",
      "• Success-contingency fee model",
      "• 24/7 case monitoring",
      "",
      `Reviews: ${SITE_URL}/reviews`,
      `Portal: ${portalUrl(vars.caseId)}`,
      `WhatsApp: ${WHATSAPP_MESSAGE_URL}`,
      vars.unsubscribeUrl ? `Unsubscribe: ${vars.unsubscribeUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
};

const educationalRedFlags: MarketingEmailTemplate = {
  id: "educational_red_flags",
  name: "Scam red flags guide",
  description:
    "Educational email — helps prospects identify recovery scams and impostor firms.",
  subject: () => "5 red flags of fake crypto recovery firms (protect yourself)",
  preheader:
    "Learn how to spot impostor recovery services before you share sensitive data.",
  buildHtml(vars) {
    const name = greetingName(vars.firstName);

    const body = `
      <p style="margin:0 0 8px;font-size:15px;color:#0f172a;">Hello <strong>${name}</strong>,</p>
      <p style="margin:0 0 20px;">After a scam, victims are often targeted <em>again</em> by fake “recovery” services. Protect yourself with these warning signs:</p>

      ${emailBulletList([
        "<strong>Upfront crypto payment</strong> — legitimate forensic firms do not demand BTC/USDT before any work.",
        "<strong>Guaranteed 100% recovery</strong> — no ethical analyst can promise full recovery; outcomes depend on fund location.",
        "<strong>Pressure to share seed phrases</strong> — never provide private keys or seed words by email or chat.",
        "<strong>No verifiable business address</strong> — check domain age, reviews, and corporate registration.",
        "<strong>Anonymous Telegram-only support</strong> — insist on official domain email (@cryptorecoveryasset.com).",
      ])}

      <p style="margin:24px 0 16px;font-size:14px;line-height:1.65;color:#475569;">Crypto Recovery Asset publishes transparent procedures, verified reviews, and secure client portals. If you are comparing providers, we welcome due diligence.</p>

      ${emailCtaLink(`${SITE_URL}/blog`, "Read forensic guides on our blog", "#2563eb")}
      ${emailCtaLink(WHATSAPP_MESSAGE_URL, "Ask us a question on WhatsApp", "#16a34a")}`;

    return wrapEmailDocument({
      title: "Scam red flags",
      preheader: educationalRedFlags.preheader,
      banner: { label: "Client safety briefing", variant: "neutral" },
      bodyHtml: body,
      unsubscribeUrl: vars.unsubscribeUrl,
    });
  },
  buildText(vars) {
    const name = (vars.firstName || "").trim() || "there";
    return [
      `Hello ${name},`,
      "",
      "5 red flags of fake crypto recovery firms:",
      "1. Upfront crypto payment demanded",
      "2. Guaranteed 100% recovery",
      "3. Requests for seed phrases",
      "4. No verifiable business presence",
      "5. Telegram-only anonymous agents",
      "",
      `Blog: ${SITE_URL}/blog`,
      `WhatsApp: ${WHATSAPP_MESSAGE_URL}`,
      vars.unsubscribeUrl ? `Unsubscribe: ${vars.unsubscribeUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
};

const reEngagement: MarketingEmailTemplate = {
  id: "re_engagement",
  name: "Re-engagement",
  description:
    "For cold leads or stalled cases — gentle follow-up to reopen the conversation.",
  subject: (vars) =>
    vars.caseId
      ? `Your case ${vars.caseId} — still here to help`
      : "Still need help with crypto recovery?",
  preheader: "Our forensic desk is available if you are ready to continue.",
  buildHtml(vars) {
    const name = greetingName(vars.firstName);
    const caseLine = vars.caseId
      ? `<p style="margin:0 0 20px;font-size:14px;color:#475569;">We have your reference <strong style="font-family:Courier,monospace;color:#1d4ed8;">${safeCaseId(vars.caseId)}</strong> on file. If documentation was missing or you had questions, we can pick up from where you left off.</p>`
      : `<p style="margin:0 0 20px;font-size:14px;color:#475569;">If you started a recovery inquiry but did not finish, or if new transaction evidence has appeared, our intake team can reopen your file.</p>`;

    const body = `
      <p style="margin:0 0 8px;font-size:15px;color:#0f172a;">Hello <strong>${name}</strong>,</p>
      ${caseLine}
      <p style="margin:0 0 24px;font-size:14px;line-height:1.65;color:#475569;">Time-sensitive blockchain traces can degrade as funds move through mixers and offshore exchanges. When you are ready, reply to this email or message us directly — there is no obligation to proceed until you are comfortable.</p>

      ${emailCtaLink(portalUrl(vars.caseId), "Continue in client portal", "#2563eb")}
      ${emailCtaLink(WHATSAPP_MESSAGE_URL, "Chat on WhatsApp", "#16a34a")}
      ${emailCtaLink(`mailto:${CONTACT_EMAIL}`, "Reply by email", "#64748b")}`;

    return wrapEmailDocument({
      title: "We are still here to help",
      preheader: reEngagement.preheader,
      banner: { label: "Follow-up from your forensic team", variant: "info" },
      bodyHtml: body,
      unsubscribeUrl: vars.unsubscribeUrl,
    });
  },
  buildText(vars) {
    const name = (vars.firstName || "").trim() || "there";
    return [
      `Hello ${name},`,
      "",
      vars.caseId
        ? `Case reference: ${vars.caseId}`
        : "You previously contacted Crypto Recovery Asset.",
      "",
      "Reply when ready — we can continue your recovery intake.",
      `Portal: ${portalUrl(vars.caseId)}`,
      `WhatsApp: ${WHATSAPP_MESSAGE_URL}`,
      vars.unsubscribeUrl ? `Unsubscribe: ${vars.unsubscribeUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  },
};

export const MARKETING_EMAIL_TEMPLATES: Record<
  MarketingTemplateId,
  MarketingEmailTemplate
> = {
  scam_recovery_campaign: scamRecoveryCampaign,
  nurture_72_hour: nurture72Hour,
  trust_social_proof: trustSocialProof,
  educational_red_flags: educationalRedFlags,
  re_engagement: reEngagement,
};

export function listMarketingTemplates(): MarketingEmailTemplate[] {
  return Object.values(MARKETING_EMAIL_TEMPLATES);
}

export function getMarketingTemplate(
  id: MarketingTemplateId
): MarketingEmailTemplate {
  const template = MARKETING_EMAIL_TEMPLATES[id];
  if (!template) {
    throw new Error(`Unknown marketing template: ${id}`);
  }
  return template;
}

export function buildMarketingEmail(
  id: MarketingTemplateId,
  vars: MarketingEmailVars = {}
): { subject: string; preheader: string; html: string; text: string } {
  const template = getMarketingTemplate(id);
  return {
    subject: template.subject(vars),
    preheader: template.preheader,
    html: template.buildHtml(vars),
    text: template.buildText(vars),
  };
}
