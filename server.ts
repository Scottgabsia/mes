import express from "express";
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
  sendSubscribeEmail,
  generateCaseId,
} from "./server/email";

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
  app.use(express.json());

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

      if (isEmailConfigured()) {
        const result = await sendRecoveryEmails(safeData);
        res.status(200).json({
          success: true,
          message: "Data securely processed.",
          caseId: result.caseId,
          emailSent: true,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Data logged (email not configured).",
          caseId: generateCaseId(),
          emailSent: false,
        });
      }
    } catch (error) {
      console.error("[Email] submit-recovery failed:", error);
      res.status(200).json({
        success: true,
        message: "Data registered. Email notification failed.",
        caseId: generateCaseId(),
        emailSent: false,
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
