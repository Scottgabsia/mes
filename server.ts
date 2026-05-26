import express from "express";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import {
  getEmailConfig,
  isResendConfigured,
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

  const { RESEND_FROM, ADMIN_EMAIL } = getEmailConfig();

  if (isResendConfigured()) {
    console.log(`[Resend] Ready — from ${RESEND_FROM} → admin ${ADMIN_EMAIL}`);
  } else {
    console.warn(
      "[Resend] RESEND_API_KEY not set — form emails will not send (Firestore still saves)."
    );
  }

  app.get("/api/health", (_req, res) => {
    const configured = isResendConfigured();
    res.json({
      status: "online",
      runtime: "node",
      emailProvider: "resend",
      emailConfigured: configured,
      resendFrom: RESEND_FROM,
      adminEmail: ADMIN_EMAIL,
      smtpConfigured: configured,
      smtpDetails: {
        host: "resend.com",
        user: RESEND_FROM,
        passSet: configured,
      },
    });
  });

  app.get("/health", (_req, res) => {
    res.redirect(302, "/api/health");
  });

  app.get("/api/debug-email", async (req, res) => {
    if (!isResendConfigured()) {
      return res.status(500).json({
        success: false,
        error:
          "Resend not configured. Set RESEND_API_KEY and RESEND_FROM in environment variables.",
      });
    }

    try {
      const target =
        (req.query.to as string) || ADMIN_EMAIL;
      const result = await sendDebugEmail(target);
      res.json({
        success: true,
        messageId: result.id,
        recipient: target,
      });
    } catch (error) {
      console.error("[Resend] debug-email failed:", error);
      const errMsg = error instanceof Error ? error.message : String(error);
      res.status(200).json({
        success: false,
        error: errMsg,
        suggestions: [
          "Verify RESEND_API_KEY at https://resend.com/api-keys",
          "Use RESEND_FROM with a domain verified in Resend (or onboarding@resend.dev for tests)",
          "Free tier only sends to your own email until domain is verified",
        ],
      });
    }
  });

  app.post("/api/submit-recovery", async (req, res) => {
    const formData = req.body;
    console.log("NEW RECOVERY REQUEST:", JSON.stringify(formData, null, 2));

    try {
      const { createdAt, ...safeData } = formData;

      if (isResendConfigured()) {
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
          message: "Data logged (Resend not configured).",
          caseId: generateCaseId(),
          emailSent: false,
        });
      }
    } catch (error) {
      console.error("[Resend] submit-recovery failed:", error);
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
      if (isResendConfigured()) {
        await sendSubscribeEmail(name, email);
      }
      res.status(200).json({
        success: true,
        message: "Successfully subscribed to the intelligence stream.",
      });
    } catch (error) {
      console.error("[Resend] subscribe failed:", error);
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

    console.log(`[PROD] Mode: production`);
    console.log(`[PROD] Port: ${PORT}`);
    console.log(`[PROD] Static root: ${distPath}`);
    console.log(`[PROD] Resend configured: ${isResendConfigured()}`);
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
