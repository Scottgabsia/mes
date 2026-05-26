import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { Resend } from "resend";

const CASE_LOOKUP_URL = "https://cryptorecoveryasset.com/case-lookup";
const WHATSAPP_URL = "https://wa.me/message/FKM22PP45SVFO1";

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
    "Crypto Recovery <onboarding@resend.dev>";
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

async function dispatchEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ id?: string; messageId?: string }> {
  const provider = getEmailProvider();
  const cfg = getEmailConfig();

  if (provider === "smtp") {
    const transporter = getSmtpTransporter();
    if (!transporter) throw new Error("SMTP not configured");

    const info = await transporter.sendMail({
      from: `"Crypto Recovery" <${cfg.SMTP_USER}>`,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      html: options.html,
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
      replyTo: options.replyTo,
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

  return dispatchEmail({
    to: target,
    subject: `${provider?.toUpperCase() ?? "EMAIL"} test — ${new Date().toLocaleTimeString()}`,
    html: `
      <div style="font-family: sans-serif; padding: 24px;">
        <h2>Email test OK</h2>
        <p>Provider: <strong>${provider}</strong></p>
        <p>If you see this in your Titan inbox, outbound mail is working.</p>
      </div>
    `,
  });
}

export async function sendRecoveryEmails(safeData: Record<string, unknown>) {
  const { ADMIN_EMAIL } = getEmailConfig();
  const generatedCaseId = generateCaseId();
  const clientEmail = String(safeData.secureComms ?? safeData.email ?? "");
  const clientName = String(
    safeData.operatorAlias ?? safeData.name ?? "Valued Client"
  );
  const formSource = String(safeData.formSource ?? "INTAKE_INITIALIZATION");
  const submittedAt = safeData.timestamp
    ? new Date(String(safeData.timestamp)).toLocaleString()
    : new Date().toLocaleString();

  await dispatchEmail({
    to: ADMIN_EMAIL,
    replyTo: clientEmail || undefined,
    subject: `[${formSource}] New Recovery Inquiry — ${generatedCaseId}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #2563eb;">${formSource}: ${generatedCaseId}</h2>
        <p><strong>Submitted:</strong> ${submittedAt}</p>
        <p><strong>Inbox:</strong> ${ADMIN_EMAIL}</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Client</h3>
          <p><strong>Name:</strong> ${clientName}</p>
          <p><strong>Email:</strong> ${clientEmail || "—"}</p>
          <p><strong>Phone:</strong> ${safeData.phone ?? "—"}</p>
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Incident</h3>
          <p><strong>Service:</strong> ${safeData.incidentVector ?? "—"}</p>
          <p><strong>Network:</strong> ${safeData.targetNetwork ?? "—"}</p>
          <p><strong>Value:</strong> $${safeData.estimatedValue ?? "—"}</p>
          <p><strong>Tx hash:</strong> ${safeData.transactionHash ?? "—"}</p>
        </div>
        <p style="white-space: pre-wrap;">${safeData.caseNarrative ?? ""}</p>
      </div>
    `,
  });

  if (clientEmail) {
    await dispatchEmail({
      to: clientEmail,
      subject: `Case received — ${generatedCaseId}`,
      html: `
        <div style="margin:0;padding:0;background:#f1f5f9;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;background:#f1f5f9;padding:0;margin:0;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td align="center" style="padding:28px 16px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px;max-width:600px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  <tr>
                    <td style="background:#0b1220;border-radius:16px 16px 0 0;padding:26px 26px 18px 26px;">
                      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#e2e8f0;font-size:12px;letter-spacing:1.6px;text-transform:uppercase;">
                        Crypto Recovery Asset
                      </div>
                      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#ffffff;font-size:22px;font-weight:700;line-height:1.25;margin-top:10px;">
                        We received your case
                      </div>
                      <div style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;color:#93c5fd;font-size:13px;margin-top:10px;">
                        Case ID: <strong style="color:#bfdbfe;">${generatedCaseId}</strong>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="background:#ffffff;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0;padding:26px;">
                      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;font-size:15px;line-height:1.6;">
                        <p style="margin:0 0 12px 0;">Hello <strong>${clientName}</strong>,</p>
                        <p style="margin:0 0 12px 0;">
                          Your request has been securely registered in our recovery queue. Our team will review the details and contact you through the email you provided.
                        </p>
                        <p style="margin:0 0 18px 0;color:#475569;">
                          Keep this Case ID for reference: <span style="font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">${generatedCaseId}</span>
                        </p>
                      </div>

                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin-top:10px;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                        <tr>
                          <td align="center" style="padding:0 0 12px 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:separate;">
                              <tr>
                                <td align="center" bgcolor="#2563eb" style="border-radius:12px;">
                                  <a href="${CASE_LOOKUP_URL}" target="_blank" rel="noopener noreferrer"
                                     style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:18px;font-weight:bold;color:#ffffff;text-decoration:none;display:inline-block;padding:16px 24px;">
                                    Check Case Status
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="center" style="padding:0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="border-collapse:separate;">
                              <tr>
                                <td align="center" bgcolor="#16a34a" style="border-radius:12px;">
                                  <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer"
                                     style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:18px;font-weight:bold;color:#ffffff;text-decoration:none;display:inline-block;padding:16px 24px;">
                                    Chat with Support on WhatsApp
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <div style="font-family:Arial,Helvetica,sans-serif;color:#64748b;font-size:12px;line-height:1.5;text-align:center;margin-top:12px;">
                        Case portal: <a href="${CASE_LOOKUP_URL}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">${CASE_LOOKUP_URL}</a><br/>
                        WhatsApp: <a href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer" style="color:#16a34a;text-decoration:underline;">${WHATSAPP_URL}</a>
                      </div>

                      <div style="margin-top:18px;padding:16px;border-radius:12px;background:#f8fafc;border:1px solid #e2e8f0;">
                        <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#0f172a;font-size:13px;font-weight:700;margin:0 0 10px 0;">
                          Next steps in your recovery
                        </div>
                        <ul style="margin:0;padding:0 0 0 18px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#334155;font-size:13px;line-height:1.6;">
                          <li style="margin:0 0 6px 0;">We validate your submission and assign an analyst to your case.</li>
                          <li style="margin:0 0 6px 0;">We trace asset movement and identify potential exchange/off-ramp touchpoints.</li>
                          <li style="margin:0 0 6px 0;">If required, we prepare evidence packages for compliance/KYC requests.</li>
                          <li style="margin:0;">You’ll receive updates via email as milestones are reached.</li>
                        </ul>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style="background:#ffffff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:18px 26px;">
                      <div style="font-family:Inter,Segoe UI,Arial,sans-serif;color:#94a3b8;font-size:11px;line-height:1.45;text-align:center;">
                        © Crypto Recovery Asset All rights reserved.<br/>
                        Private & Confidential • Forensic Intelligence Services
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    });
  }

  return { caseId: generatedCaseId, emailSent: true };
}

export async function sendSubscribeEmail(name: string, email: string) {
  const { ADMIN_EMAIL } = getEmailConfig();

  await dispatchEmail({
    to: ADMIN_EMAIL,
    subject: `Newsletter: ${name}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px;">
        <h2>New subscription</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  return { emailSent: true };
}
