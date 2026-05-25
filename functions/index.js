const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const {
  getSmtpConfig,
  sendRecoveryEmails,
  sendSubscribeEmail,
} = require("./lib/mail.js");

function createApiApp() {
  const app = express();
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, ADMIN_EMAIL } = getSmtpConfig();
    res.json({
      status: "online",
      smtpConfigured: !!(SMTP_HOST && SMTP_USER && SMTP_PASS),
      adminEmail: ADMIN_EMAIL,
      smtpDetails: {
        host: SMTP_HOST,
        user: SMTP_USER,
        passSet: !!SMTP_PASS,
      },
      backend: "firebase-functions",
    });
  });

  app.post("/api/submit-recovery", async (req, res) => {
    try {
      const { createdAt, ...safeData } = req.body || {};
      const result = await sendRecoveryEmails(safeData);
      res.status(200).json({
        success: true,
        message: result.message,
        caseId: result.caseId,
        emailSent: result.emailSent,
      });
    } catch (error) {
      console.error("[SMTP ERROR]", error);
      res.status(200).json({
        success: true,
        emailSent: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    const { name, email } = req.body || {};
    try {
      const result = await sendSubscribeEmail(name, email);
      res.status(200).json({ success: true, emailSent: result.emailSent });
    } catch (error) {
      console.error("[SMTP ERROR]", error);
      res.status(200).json({ success: true, emailSent: false });
    }
  });

  return app;
}

/** https://REGION-PROJECT.cloudfunctions.net/mes/api/health */
exports.mes = onRequest({ cors: true, region: "us-central1" }, createApiApp());
