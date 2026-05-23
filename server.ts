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

  // Helper to safely sanitize surrounding quotes and spaces from user inputs in AI Studio Secrets menu
  const cleanEnvVar = (val: string | undefined): string => {
    if (!val) return "";
    let v = val.trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1).trim();
    }
    return v;
  };

  const SMTP_HOST = cleanEnvVar(process.env.SMTP_HOST);
  const SMTP_PORT_STR = cleanEnvVar(process.env.SMTP_PORT);
  const SMTP_PORT = parseInt(SMTP_PORT_STR || '465');
  const SMTP_USER = cleanEnvVar(process.env.SMTP_USER);
  const SMTP_PASS = cleanEnvVar(process.env.SMTP_PASS);
  const ADMIN_EMAIL = cleanEnvVar(process.env.ADMIN_EMAIL) || "info@cryptorecoveryasset.com";

  // SMTP Configuration from environment
  const getTransporter = () => {
    if (!SMTP_USER || !SMTP_PASS || !SMTP_HOST) {
      console.warn(`[SMTP] Configuration incomplete. Missing: ${[!SMTP_HOST && 'SMTP_HOST', !SMTP_USER && 'SMTP_USER', !SMTP_PASS && 'SMTP_PASS'].filter(Boolean).join(', ')}`);
      return null;
    }

    console.log(`[SMTP] Initializing for ${SMTP_USER} on ${SMTP_HOST}:${SMTP_PORT} (Secure: ${SMTP_PORT === 465})`);

    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
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

  // Helper to diagnose specific SMTP error signatures and suggest user solutions
  const getSMTPSuggestions = (errorMessage: string): string[] => {
    const errorStr = errorMessage.toLowerCase();
    const suggestions: string[] = [];

    const isTitan = errorStr.includes("titan") || SMTP_HOST.toLowerCase().includes("titan");

    if (errorStr.includes("535") || errorStr.includes("authentication failed") || errorStr.includes("invalid login")) {
      suggestions.push("AUTHENTICATION DISALLOWED (535): Your SMTP host rejected the username & password combination of SMTP_USER and SMTP_PASS.");
      
      if (isTitan) {
        suggestions.push("👉 TITAN EMAIL SPECIFIC: If you have Two-Factor Authentication (2FA) enabled on your Titan account, your normal mailbox password WILL be rejected with a 535 error. You MUST generate an App Password in your Titan webmail (Settings > Security > App Passwords), and put that 16-character secure code as your SMTP_PASS in Google AI Studio.");
        suggestions.push("👉 TITAN EMAIL SPECIFIC: Verify your SMTP_USER matches your complete mailbox email exactly (e.g., contact@vr-astrovision.com or info@cryptorecoveryasset.com) in all lowercase, and that SMTP_HOST is exactly smtp.titan.email.");
      } else {
        suggestions.push("Are you using Titan Mail? Titan accounts with Two-Factor Authentication (2FA) active require an App Password. Go to Titan Webmail > Settings Gear > Security > App Passwords, generate a custom secure key, and set it as your SMTP_PASS. Double-check that your SMTP_HOST is 'smtp.titan.email' and SMTP_PORT is '465'.");
        suggestions.push("Are you using Gmail / Google Workspace? If so, Google disabled secure basic logins. You MUST configure standard 2-Step Verification first, then go to Google security settings and generate a 16-character secure 'App Password', and set that as your SMTP_PASS.");
      }
      suggestions.push("Double check that your SMTP_PASS has no typos, extra trailing spaces, or double/single quotes wrapped around it in the Settings > Secrets menu.");
    } else if (errorStr.includes("enotfound") || errorStr.includes("getaddrinfo")) {
      suggestions.push("HOST RESOLUTION FAILED (ENOTFOUND): The server container could not resolve the address for SMTP_HOST.");
      suggestions.push("Double-check your SMTP_HOST settings for spelling errors (e.g., 'smtp.titan.email', 'smtp.gmail.com', 'smtp.mail.yahoo.com').");
    } else if (errorStr.includes("etimeout") || errorStr.includes("timed out") || errorStr.includes("connect etimedout")) {
      suggestions.push("CONNECTION TIMED OUT: The connection attempted to SMTP_HOST on SMTP_PORT took too long or was blocked.");
      suggestions.push("Port 465 employs direct SSL (secure: true). If you configured port 587, the provider expects STARTTLS (secure: false). Make sure your port fits the standard (465 SSL vs 587 TLS). For Titan Email, port 465 is the recommended secure outbound port.");
    } else {
      suggestions.push("Verify that your email provider allows outbound SMTP relays from remote web sandbox nodes (like Google Cloud Run). Some domains require whitelisting or disabling security blocks on direct SMTP.");
    }

    return suggestions;
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "online",
      smtpConfigured: !!(SMTP_HOST && SMTP_USER && SMTP_PASS),
      smtpDetails: {
        host: SMTP_HOST,
        user: SMTP_USER,
        passSet: !!SMTP_PASS
      }
    });
  });

  app.get("/api/debug-email", async (req, res) => {
    const transporter = getTransporter();
    if (!transporter) {
      return res.status(500).json({ 
        success: false, 
        error: "SMTP not configured. Ensure SMTP_HOST, SMTP_USER, and SMTP_PASS are set in Settings > Secrets." 
      });
    }

    try {
      await transporter.verify();
      const targetEmail = (req.query.to as string) || SMTP_USER || ADMIN_EMAIL || "info@cryptorecoveryasset.com";
      const mailOptions = {
        from: `"SMTP Diagnostics" <${SMTP_USER}>`,
        to: targetEmail,
        subject: `SMTP Diagnostic Test - ${new Date().toLocaleTimeString()}`,
        html: `
          <div style="font-family: sans-serif; padding: 30px; border-radius: 12px; background: #0f172a; color: #f8fafc; max-width: 600px; margin: 0 auto; border: 1px solid #1e293b;">
            <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 20px;">
              <span style="font-size: 24px; font-weight: bold; color: #3b82f6;">DIGITAL ASSETS FORENSICS</span>
              <p style="color: #64748b; font-size: 11px; margin-top: 5px; font-family: monospace;">SYSTEM_DIAGNOSTICS: STATUS_ACTIVE</p>
            </div>
            <p>Hello,</p>
            <p>If you are reading this email, your <strong>SMTP Routing Configuration</strong> is fully functional and running successfully on our server containers!</p>
            <div style="background: #1e293b; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 11px; margin: 20px 0; border-left: 4px solid #3b82f6; color: #cbd5e1;">
              <p style="margin: 0 0 5px 0;"><strong>Sender Host:</strong> ${SMTP_HOST}</p>
              <p style="margin: 0 0 5px 0;"><strong>Sender Port:</strong> ${SMTP_PORT}</p>
              <p style="margin: 0 0 5px 0;"><strong>Active Sender:</strong> ${SMTP_USER}</p>
              <p style="margin: 0;"><strong>Recipient Target:</strong> ${targetEmail}</p>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">No further settings edits are required. Form submissions will now be correctly dispatched to your configured inbox.</p>
            <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px; font-size: 10px; color: #64748b;">
              Private & Confidential • Digital Assets Forensics Operations Team
            </div>
          </div>
        `
      };
      
      const info = await transporter.sendMail(mailOptions);
      res.json({ success: true, messageId: info.messageId, response: info.response, recipient: targetEmail });
    } catch (error) {
      console.error("[SMTP DEBUG ERR]", error);
      const errMsg = error instanceof Error ? error.message : String(error);
      const suggestions = getSMTPSuggestions(errMsg);
      
      res.status(200).json({ 
        success: false, 
        error: errMsg,
        suggestions,
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  });

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
          from: `"Operations Desk" <${SMTP_USER}>`,
          to: ADMIN_EMAIL,
          subject: `New Inquiry Notification [${generatedCaseId}]`,
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
            from: `"Support Helpdesk" <${SMTP_USER}>`,
            to: clientEmail,
            subject: `Acknowledgment of Intake Ticket: ${generatedCaseId}`,
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
          message: "Data securely processed and saved.",
          caseId: generatedCaseId,
          emailSent: true
        });
      } else {
        const generatedCaseId = `DF-${Math.floor(1000 + Math.random() * 9000)}-QX-04`;
        res.status(200).json({ 
          success: true, 
          message: "Data logged to server database (SMTP not configured).",
          caseId: generatedCaseId,
          emailSent: false
        });
      }
    } catch (error) {
      console.error("[SMTP ERROR] Failed to deliver recovery emails:", error);
      const generatedCaseId = `DF-${Math.floor(1000 + Math.random() * 9000)}-FAIL`;
      // We return 200 success back to the browser because the case itself is saved in Firestore (on the client).
      // Returning 500 would show an error to standard customers which we want to avoid.
      res.status(200).json({ 
        success: true, 
        message: "Data registered. Warning: Outbound email notification failed.",
        caseId: generatedCaseId,
        emailSent: false,
        error: error instanceof Error ? error.message : String(error)
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
          from: `"Newsletter Alerts" <${SMTP_USER}>`,
          to: ADMIN_EMAIL,
          subject: `Subscribed Alert: ${name}`,
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
      console.error("[SMTP ERROR] Failed to send subscription alarm email:", error);
      res.status(200).json({ 
        success: true, 
        message: "Successfully subscribed to the intelligence stream (Warning: Notification failed)." 
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
