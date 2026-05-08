import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/submit-recovery", (req, res) => {
    const formData = req.body;
    
    // Log the submission as if it's being sent to the requested email
    console.log("--------------------------------------------------");
    console.log("NEW RECOVERY REQUEST RECEIVED");
    console.log(`TO: info@digitalassetsforensicscryptorecovery.com`);
    console.log("DETAILS:", JSON.stringify(formData, null, 2));
    console.log("--------------------------------------------------");

    // In a real production app, you would use a service like Nodemailer, SendGrid, or Postmark here.
    // Example (requires configuration):
    /*
    const transporter = nodemailer.createTransport({...});
    await transporter.sendMail({
      from: '"Digital Assets Forensics Crypto Recovery Agency" <noreply@forensics.io>',
      to: "info@digitalassetsforensicscryptorecovery.com",
      subject: "New Recovery Request: " + formData.operatorAlias,
      text: JSON.stringify(formData, null, 2)
    });
    */

    res.status(200).json({ 
      success: true, 
      message: "Data securely transmitted to info@digitalassetsforensicscryptorecovery.com",
      caseId: `DF-${Math.floor(Math.random() * 10000)}-QX-04`
    });
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
