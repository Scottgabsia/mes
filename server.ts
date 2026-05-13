import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SMTP Configuration from environment
  const getTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || '465');
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!user || !pass || !host) {
      console.warn("[SMTP] Configuration missing. Please set SMTP_HOST, SMTP_USER, and SMTP_PASS in your environment.");
      return null;
    }

    console.log(`[SMTP] Initializing for ${user} on ${host}:${port}`);

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  };

  // Verify SMTP Connection on startup
  const testTransporter = getTransporter();
  if (testTransporter) {
    testTransporter.verify((error, success) => {
      if (error) {
        console.error("[SMTP] Verification Failed:", error);
      } else {
        console.log("[SMTP] Server connection verified successfully");
      }
    });
  }

  // API Routes
  app.post("/api/submit-recovery", async (req, res) => {
    const formData = req.body;
    
    console.log("--------------------------------------------------");
    console.log("NEW RECOVERY REQUEST RECEIVED");
    console.log("DETAILS:", JSON.stringify(formData, null, 2));
    console.log("--------------------------------------------------");

    try {
      const { 
        createdAt, 
        ...safeData 
      } = formData;

      const transporter = getTransporter();
      if (transporter) {
        const generatedCaseId = `DF-${Math.floor(1000 + Math.random() * 9000)}-${Buffer.from(Date.now().toString()).toString('base64').substring(0, 4).toUpperCase()}`;
        const clientEmail = safeData.secureComms || safeData.email;
        const clientName = safeData.operatorAlias || safeData.name || "Valued Client";

        // 1. Send Notification to Admin
        const adminMailOptions = {
          from: `"Recovery Portal" <${process.env.SMTP_USER}>`,
          to: "info@digitalassetsforensiccryptorecovery.com",
          subject: `NEW LEAD [${generatedCaseId}]: ${safeData.operatorAlias} | ${safeData.incidentVector}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Recovery Lead: ${generatedCaseId}</h2>
              <p><strong>System Identification:</strong> ${new Date().toLocaleString()}</p>
              
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #334155;">Client Manifest</h3>
                <p><strong>Full Name:</strong> ${clientName}</p>
                <p><strong>Email Address:</strong> ${clientEmail}</p>
                <p><strong>Phone:</strong> ${safeData.phone}</p>
              </div>

              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #334155;">Incident Parameters</h3>
                <p><strong>Service Type:</strong> ${safeData.incidentVector}</p>
                <p><strong>Target Network:</strong> ${safeData.targetNetwork}</p>
                <p><strong>Asset Value Estimate:</strong> $${safeData.estimatedValue}</p>
                <p><strong>Transaction Hash:</strong> <code style="background: #e2e8f0; padding: 2px 4px; border-radius: 4px;">${safeData.transactionHash}</code></p>
              </div>

              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #334155;">Case Narrative</h3>
                <p style="white-space: pre-wrap;">${safeData.caseNarrative}</p>
              </div>
              
              <p style="font-size: 10px; color: #64748b; margin-top: 30px;">
                This is an automated encrypted transmission from the Digital Assets Forensics recovery portal.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(adminMailOptions);

        // 2. Send Confirmation to Client
        if (clientEmail) {
          const clientMailOptions = {
            from: `"Digital Assets Forensics" <${process.env.SMTP_USER}>`,
            to: clientEmail,
            subject: `Case Initialized: ${generatedCaseId} - Documentation Received`,
            html: `
              <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; color: #020617; line-height: 1.6;">
                <div style="background: #020617; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
                  <h1 style="color: #3b82f6; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px;">Intake Confirmed</h1>
                  <p style="color: #94a3b8; font-size: 12px; margin-top: 10px; font-family: monospace;">STATUS: ENCRYPTED_PROCESSING</p>
                </div>
                
                <div style="padding: 40px 30px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
                  <p style="font-size: 16px;">Hello <strong>${clientName}</strong>,</p>
                  <p>Your case has been successfully initialized in our forensic queue. Our intelligence team is currently performing the initial heuristic sweep based on the technical parameters you provided.</p>
                  
                  <div style="background: #f1f5f9; padding: 20px; border-radius: 12px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                    <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">Recovery Case ID</p>
                    <p style="margin: 5px 0 0 0; font-size: 20px; font-weight: 800; color: #1e293b; font-family: monospace;">${generatedCaseId}</p>
                  </div>

                  <h3 style="color: #1e293b; margin-top: 40px;">Next Steps in Your Recovery</h3>
                  <ul style="padding-left: 20px; color: #475569;">
                    <li style="margin-bottom: 10px;">Forensic Analysts will trace the asset movement to identified exit-ramps.</li>
                    <li style="margin-bottom: 10px;">KYC-request documentation is being prepared for the target exchanges.</li>
                    <li style="margin-bottom: 10px;">Our legal council will review the jurisdictional viability for a freezing order.</li>
                  </ul>

                  <div style="margin-top: 40px; text-align: center;">
                    <a href="https://wa.me/2347069151241?text=Hello,%20I%20am%20enquiring%20about%20my%20case%20${generatedCaseId}" 
                       style="display: inline-block; background: #25d366; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; margin-bottom: 15px; width: 100%; box-sizing: border-box;">
                       SECURE CHAT VIA WHATSAPP
                    </a>
                    
                    <a href="https://digitalassetsforensiccryptorecovery.com/status?case=${generatedCaseId}" 
                       style="display: inline-block; background: #1e293b; color: #ffffff; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; width: 100%; box-sizing: border-box;">
                       CHECK LIVE CASE STATUS
                    </a>
                  </div>
                </div>

                <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 16px 16px; border: 1px solid #e2e8f0; border-top: none; text-align: center;">
                  <p style="font-size: 11px; color: #64748b; margin: 0;">
                    © 2026 Digital Assets Forensics. All rights reserved.<br>
                    Private & Confidential • Forensic Intelligence Services
                  </p>
                  <p style="font-size: 10px; color: #cbd5e1; margin-top: 10px;">
                    DO NOT REPLY Directly to this automated notification. Use the secure links above for operational updates.
                  </p>
                </div>
              </div>
            `,
          };

          await transporter.sendMail(clientMailOptions);
        }
        
        res.status(200).json({ 
          success: true, 
          message: "Data securely transmitted and confirmation sent.",
          caseId: generatedCaseId
        });
      } else {
        const generatedCaseId = `DF-${Math.floor(Math.random() * 10000)}-QX-04`;
        res.status(200).json({ 
          success: true, 
          message: "Data logged to server (SMTP not configured).",
          caseId: generatedCaseId
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

  app.post("/api/subscribe", async (req, res) => {
    const { name, email } = req.body;
    
    console.log("--------------------------------------------------");
    console.log("NEW BLOG SUBSCRIPTION");
    console.log(`NAME: ${name}`);
    console.log(`EMAIL: ${email}`);
    console.log("--------------------------------------------------");

    try {
      const transporter = getTransporter();
      if (transporter) {
        const mailOptions = {
          from: `"Intelligence Stream" <${process.env.SMTP_USER}>`,
          to: "info@digitalassetsforensiccryptorecovery.com",
          subject: `NEW BLOG SUBSCRIBER: ${name}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
              <h2 style="color: #2563eb; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">New Blog Subscription</h2>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
              </div>
              <p style="font-size: 10px; color: #64748b; margin-top: 30px;">
                This user has requested to join the Digital Assets Forensics intelligence stream.
              </p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
      
      res.status(200).json({ 
        success: true, 
        message: "Successfully subscribed to the intelligence stream." 
      });
    } catch (error) {
      console.error("Failed to process subscription email:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to process subscription" 
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
    // In production, serving from the root via server.ts or from dist via node dist/server.js
    // We determine dist path relative to current working directory or __dirname
    const distPath = path.join(process.cwd(), 'dist');
    const indexPath = path.join(distPath, "index.html");
    
    console.log(`[PROD] Mode detected`);
    console.log(`[PROD] Static files: ${distPath}`);
    console.log(`[PROD] Entry point: ${indexPath}`);
    
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
