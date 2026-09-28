#!/usr/bin/env node
/**
 * Hostinger Node.js entry point.
 * hPanel → Entry file: app.cjs
 * Runs production build automatically if dist/ is missing.
 */
"use strict";

const fs = require("fs");
const os = require("os");
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

function isUnsafeDir(dir) {
  const n = String(dir).replace(/\\/g, "/").toLowerCase();
  return (
    n.includes("/.builds/") ||
    n.endsWith("/.builds") ||
    n.includes("/node_modules/")
  );
}

/**
 * Cases must live OUTSIDE the git deploy folder — Hostinger replaces the app on each push.
 * Default: /home/USER/cryptorecovery-case-data (survives GitHub redeploys and .builds cleanup).
 */
if (!process.env.CASE_DATA_DIR?.trim()) {
  const homeStore = path.join(os.homedir(), "cryptorecovery-case-data");
  const autoDir =
    pickWritableDir(
      [
        homeStore,
        path.join(root, "..", "..", "cryptorecovery-case-data"),
        path.join(root, "..", "cryptorecovery-case-data"),
      ].filter((dir) => !isUnsafeDir(dir))
    ) || homeStore;
  process.env.CASE_DATA_DIR = autoDir;
  console.log(
    "[app] CASE_DATA_DIR not set — using persistent path:",
    autoDir
  );
  console.log(
    "[app] Tip: set CASE_DATA_DIR=/home/u695441817/cryptorecovery-case-data in hPanel"
  );
} else {
  process.env.CASE_DATA_DIR = path.resolve(process.env.CASE_DATA_DIR.trim());
  if (isUnsafeDir(process.env.CASE_DATA_DIR)) {
    const homeStore = path.join(os.homedir(), "cryptorecovery-case-data");
    console.warn(
      "[app] CASE_DATA_DIR is under .builds/tmp — switching to",
      homeStore
    );
    process.env.CASE_DATA_DIR = homeStore;
  }
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

