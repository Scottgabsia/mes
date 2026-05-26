import { Resend } from "resend";

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
  const RESEND_API_KEY = cleanEnvVar(process.env.RESEND_API_KEY);
  const RESEND_FROM =
    cleanEnvVar(process.env.RESEND_FROM) ||
    "Crypto Recovery <onboarding@resend.dev>";
  const ADMIN_EMAIL =
    cleanEnvVar(process.env.ADMIN_EMAIL) || "info@cryptorecoveryasset.com";

  return { RESEND_API_KEY, RESEND_FROM, ADMIN_EMAIL };
}

export function isResendConfigured(): boolean {
  return !!getEmailConfig().RESEND_API_KEY;
}

function getClient(): Resend | null {
  const { RESEND_API_KEY } = getEmailConfig();
  if (!RESEND_API_KEY) return null;
  return new Resend(RESEND_API_KEY);
}

export function generateCaseId(): string {
  return `DF-${Math.floor(1000 + Math.random() * 9000)}-${Buffer.from(Date.now().toString()).toString("base64").substring(0, 4).toUpperCase()}`;
}

async function sendEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ id: string | undefined }> {
  const client = getClient();
  const { RESEND_FROM, ADMIN_EMAIL } = getEmailConfig();

  if (!client) {
    throw new Error(
      "Resend not configured. Set RESEND_API_KEY in environment variables."
    );
  }

  const { data, error } = await client.emails.send({
    from: RESEND_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    replyTo: options.replyTo,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { id: data?.id };
}

export async function sendDebugEmail(to: string) {
  const { RESEND_FROM, ADMIN_EMAIL } = getEmailConfig();
  const target = to || ADMIN_EMAIL;

  return sendEmail({
    to: target,
    subject: `Resend test — ${new Date().toLocaleTimeString()}`,
    html: `
      <div style="font-family: sans-serif; padding: 30px; border-radius: 12px; background: #0f172a; color: #f8fafc; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Email test OK</h2>
        <p>If you received this, Resend is configured correctly.</p>
        <p style="font-family: monospace; font-size: 12px; color: #94a3b8;">
          From: ${RESEND_FROM}<br/>
          To: ${target}
        </p>
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

  await sendEmail({
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
    await sendEmail({
      to: clientEmail,
      subject: `Intake confirmed: ${generatedCaseId}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <p>Hello <strong>${clientName}</strong>,</p>
          <p>Your case <strong>${generatedCaseId}</strong> was received. Our team will review it shortly.</p>
          <p><a href="https://cryptorecoveryasset.com/case-lookup?case=${generatedCaseId}">Check case status</a></p>
        </div>
      `,
    });
  }

  return { caseId: generatedCaseId, emailSent: true };
}

export async function sendSubscribeEmail(name: string, email: string) {
  const { ADMIN_EMAIL } = getEmailConfig();

  await sendEmail({
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
