#!/usr/bin/env node
/**
 * Hostinger Node.js entry point.
 * hPanel → Entry file: app.cjs
 * Runs production build automatically if dist/ is missing.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = __dirname;
const serverPath = path.join(root, "dist", "server.cjs");
const indexPath = path.join(root, "dist", "index.html");

function ensureBuild() {
  if (fs.existsSync(serverPath) && fs.existsSync(indexPath)) {
    return;
  }

  console.log("[app] dist/ incomplete — running npm run build...");
  try {
    execSync("npm run build", {
      cwd: root,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "production" },
    });
  } catch (err) {
    console.error("[FATAL] npm run build failed:", err.message || err);
    process.exit(1);
  }

  if (!fs.existsSync(serverPath)) {
    console.error(
      "[FATAL] dist/server.cjs still missing after build. Check Hostinger build logs."
    );
    process.exit(1);
  }
}

ensureBuild();

const dataDir = process.env.CASE_DATA_DIR
  ? path.resolve(process.env.CASE_DATA_DIR)
  : path.join(root, "data");
try {
  fs.mkdirSync(dataDir, { recursive: true });
} catch (err) {
  console.warn("[app] Could not create data directory:", dataDir, err.message);
}

require(serverPath);
