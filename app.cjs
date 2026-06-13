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

function pickWritableDir(candidates) {
  for (const dir of candidates) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      const probe = path.join(dir, ".write-test");
      fs.writeFileSync(probe, "ok", "utf8");
      fs.unlinkSync(probe);
      return dir;
    } catch {
      /* try next */
    }
  }
  return candidates[candidates.length - 1];
}

ensureBuild();

// App root for legacy case-file migration (server/caseStore.ts)
process.env.APP_ROOT = root;

/**
 * Cases must live OUTSIDE the git deploy folder — Hostinger replaces the app on each push.
 * Default: domains/yoursite.com/case-data (two levels above app root).
 */
if (!process.env.CASE_DATA_DIR?.trim()) {
  const autoDir = pickWritableDir([
    path.join(root, "..", "..", "case-data"),
    path.join(root, "..", "case-data"),
    path.join(root, "data"),
  ]);
  process.env.CASE_DATA_DIR = autoDir;
  console.log(
    "[app] CASE_DATA_DIR not set — using persistent path:",
    autoDir
  );
  console.log(
    "[app] Tip: set CASE_DATA_DIR in hPanel to e.g. /home/USER/domains/cryptorecoveryasset.com/data"
  );
} else {
  process.env.CASE_DATA_DIR = path.resolve(process.env.CASE_DATA_DIR.trim());
}

try {
  fs.mkdirSync(process.env.CASE_DATA_DIR, { recursive: true });
} catch (err) {
  console.warn(
    "[app] Could not create CASE_DATA_DIR:",
    process.env.CASE_DATA_DIR,
    err.message
  );
}

require(serverPath);

