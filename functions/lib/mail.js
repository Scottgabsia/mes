import nodemailer from "nodemailer";

export function cleanEnvVar(val) {
  if (!val) return "";
  let v = String(val).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

export function getSmtpConfig(env = process.env) {
  const SMTP_HOST = cleanEnvVar(env.SMTP_HOST);
  const SMTP_PORT = parseInt(cleanEnvVar(env.SMTP_PORT) || "465", 10);
  const SMTP_USER = cleanEnvVar(env.SMTP_USER);
  const SMTP_PASS = cleanEnvVar(env.SMTP_PASS);
  const ADMIN_EMAIL =
    cleanEnvVar(env.ADMIN_EMAIL) || "info@cryptorecoveryasset.com";

  return { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL };
}

export function getTransporter(env = process.env) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = getSmtpConfig(env);

  if (!SMTP_USER || !SMTP_PASS || !SMTP_HOST) {
    return null;
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    tls: { rejectUnauthorized: false },
  });
}

export function generateCaseId() {
  return `DF-${Math.floor(1000 + Math.random() * 9000)}-${Buffer.from(Date.now().toString()).toString("base64").substring(0, 4).toUpperCase()}`;
}

export async function sendRecoveryEmails(safeData, env = process.env) {
  const { SMTP_USER, ADMIN_EMAIL } = getSmtpConfig(env);
  const transporter = getTransporter(env);

  if (!transporter) {
    return {
      emailSent: false,
      caseId: generateCaseId(),
      message: "SMTP not configured",
    };
  }

  const generatedCaseId = generateCaseId();
  const clientEmail = safeData.secureComms || safeData.email;
  const clientName = safeData.operatorAlias || safeData.name || "Valued Client";
  const formSource = safeData.formSource || "INTAKE_INITIALIZATION";
  const submittedAt = safeData.timestamp
    ? new Date(safeData.timestamp).toLocaleString()
    : new Date().toLocaleString();

  await transporter.sendMail({
    from: `"Operations Desk" <${SMTP_USER}>`,
    to: ADMIN_EMAIL,
    replyTo: clientEmail || undefined,
    subject: `[${formSource}] New Recovery Inquiry — ${generatedCaseId}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">${formSource}: ${generatedCaseId}</h2>
        <p><strong>Submitted:</strong> ${submittedAt}</p>
        <p><strong>Notification inbox:</strong> ${ADMIN_EMAIL}</p>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Client Manifest</h3>
          <p><strong>Full Name:</strong> ${clientName}</p>
          <p><strong>Email Address:</strong> ${clientEmail || "—"}</p>
          <p><strong>Phone:</strong> ${safeData.phone || "—"}</p>
          <p><strong>Status:</strong> ${safeData.status || "PENDING"}</p>
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Incident Parameters</h3>
          <p><strong>Service Type:</strong> ${safeData.incidentVector || "—"}</p>
          <p><strong>Target Network:</strong> ${safeData.targetNetwork || "—"}</p>
          <p><strong>Asset Value Estimate:</strong> $${safeData.estimatedValue ?? "—"}</p>
          <p><strong>Transaction Hash:</strong> <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${safeData.transactionHash || "—"}</code></p>
        </div>
        <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #334155;">Case Narrative</h3>
          <p style="white-space: pre-wrap;">${safeData.caseNarrative || "—"}</p>
        </div>
      </div>
    `,
  });

  if (clientEmail) {
    const lookupUrl = `https://cryptorecoveryasset.com/case-lookup?ref=${encodeURIComponent(generatedCaseId)}`;
    const textBody = [
      "CRYPTO RECOVERY ASSET — INTAKE CONFIRMATION",
      "",
      `Hello ${clientName},`,
      "",
      "Thank you for submitting your intake form. Your information has been received.",
      "",
      `Reference ID: ${generatedCaseId}`,
      "",
      `Track status: ${lookupUrl}`,
      "",
      "Reply to this email or contact info@cryptorecoveryasset.com if you need help.",
    ].join("\n");

    await transporter.sendMail({
      from: `"Crypto Recovery Asset" <${SMTP_USER}>`,
      to: clientEmail,
      replyTo: ADMIN_EMAIL,
      subject: `Your intake reference ${generatedCaseId} — Crypto Recovery Asset`,
      text: textBody,
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #334155; line-height: 1.65;">
          <p style="display:none;max-height:0;overflow:hidden;opacity:0;">We received your intake form. Reference ${generatedCaseId}.</p>
          <p>Hello <strong>${clientName}</strong>,</p>
          <p>Thank you for submitting your intake form to <strong>Crypto Recovery Asset</strong>. Your reference is <strong>${generatedCaseId}</strong>.</p>
          <p><a href="${lookupUrl}" style="background:#2563eb;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;font-weight:bold;">Check case status</a></p>
          <p style="font-size:12px;color:#64748b;">Questions? Reply to this email or write to info@cryptorecoveryasset.com</p>
        </div>
      `,
      headers: {
        "X-Auto-Response-Suppress": "All",
        Precedence: "normal",
        "X-Entity-Ref-ID": `intake-${generatedCaseId}`,
      },
    });
  }

  return {
    emailSent: true,
    caseId: generatedCaseId,
    message: "Emails sent",
  };
}

export async function sendSubscribeEmail(name, email, env = process.env) {
  const { SMTP_USER, ADMIN_EMAIL } = getSmtpConfig(env);
  const transporter = getTransporter(env);
  if (!transporter) return { emailSent: false };

  await transporter.sendMail({
    from: `"Newsletter Alerts" <${SMTP_USER}>`,
    to: ADMIN_EMAIL,
    subject: `Subscribed Alert: ${name}`,
    html: `
      <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #2563eb;">New Blog Subscription</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      </div>
    `,
  });

  return { emailSent: true };
}
