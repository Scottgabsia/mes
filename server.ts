import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SMTP Configuration from environment
  const getTransporter = () => {
    const host = process.env.SMTP_HOST || 'smtp.titan.email';
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER || 'info@digitalassetsforensiccryptorecovery.com';
    const pass = process.env.SMTP_PASS || 'Michealg12$';

    if (!user || !pass) {
      console.warn("SMTP credentials missing, using mock logging.");
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user,
        pass,
      },
    });
  };

  // API Routes
  app.post("/api/submit-recovery", async (req, res) => {
    const formData = req.body;
    
    console.log("--------------------------------------------------");
    console.log("NEW RECOVERY REQUEST RECEIVED");
    console.log("DETAILS:", JSON.stringify(formData, null, 2));
    console.log("--------------------------------------------------");

    try {
      const transporter = getTransporter();
      if (transporter) {
        const mailOptions = {
          from: `"System Alert" <${process.env.SMTP_USER || 'info@digitalassetsforensiccryptorecovery.com'}>`,
          to: "info@digitalassetsforensiccryptorecovery.com",
          subject: `NEW LEAD: ${formData.operatorAlias} | ${formData.incidentVector}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Recovery Lead Received</h2>
              <p><strong>System Identification:</strong> ${new Date().toLocaleString()}</p>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #334155;">Client Manifest</h3>
                <p><strong>Full Name:</strong> ${formData.operatorAlias}</p>
                <p><strong>Email Address:</strong> ${formData.secureComms}</p>
                <p><strong>Phone:</strong> ${formData.phone}</p>
              </div>

              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #334155;">Incident Parameters</h3>
                <p><strong>Service Type:</strong> ${formData.incidentVector}</p>
                <p><strong>Target Network:</strong> ${formData.targetNetwork}</p>
                <p><strong>Asset Value Estimate:</strong> $${formData.estimatedValue}</p>
                <p><strong>Transaction Hash:</strong> <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${formData.transactionHash}</code></p>
              </div>

              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #334155;">Case Narrative</h3>
                <p style="white-space: pre-wrap;">${formData.caseNarrative}</p>
              </div>
              
              <p style="font-size: 10px; color: #64748b; margin-top: 30px;">
                This is an automated encrypted transmission from the Digital Assets Forensics recovery portal.
              </p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: " + info.messageId);
        
        res.status(200).json({ 
          success: true, 
          message: "Data securely transmitted and email notification sent.",
          caseId: `DF-${Math.floor(Math.random() * 10000)}-QX-04`
        });
      } else {
        res.status(200).json({ 
          success: true, 
          message: "Data logged to server (SMTP not configured).",
          caseId: `DF-${Math.floor(Math.random() * 10000)}-QX-04`
        });
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      // We still return 200/success because the lead was at least logged to the console
      // and usually Firestore (handled in frontend). But we can return a partial success.
      res.status(500).json({ 
        success: false, 
        error: "Failed to send email notification",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, server.js is compiled into the dist folder.
    // So __dirname will be the dist directory itself.
    const distPath = __dirname;
    const indexPath = path.join(distPath, "index.html");
    
    console.log(`[PROD] Serving static files from: ${distPath}`);
    console.log(`[PROD] Using index.html at: ${indexPath}`);
    
    // Serve static files
    app.use(express.static(distPath, {
      index: false, // We'll handle the root and fallbacks manually
    }));
    
    // Root route
    app.get("/", (req, res) => {
      res.sendFile(indexPath);
    });

    // API 404s
    app.get("/api/*", (req, res) => {
      res.status(404).json({ error: "API route not found" });
    });

    // SPA fallback
    app.get("*", (req, res) => {
      // Check if file exists to provide better errors
      res.sendFile(indexPath, (err) => {
        if (err) {
          console.error(`[ERROR] Failed to send index.html for ${req.url}:`, err);
          res.status(500).send("Application load error (index.html not found).");
        }
      });
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
