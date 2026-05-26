#!/usr/bin/env node
/**
 * Hostinger Node.js entry point.
 * hPanel → Node.js App → Entry file: app.cjs
 */
"use strict";

const fs = require("fs");
const path = require("path");

const serverPath = path.join(__dirname, "dist", "server.cjs");

if (!fs.existsSync(serverPath)) {
  console.error(
    "[FATAL] dist/server.cjs not found. Run: npm run build"
  );
  process.exit(1);
}

require(serverPath);
