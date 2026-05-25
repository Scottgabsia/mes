import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const required = ["index.html", "server.cjs"];

const missing = required.filter((file) => !fs.existsSync(path.join(dist, file)));

if (missing.length) {
  console.error("[build] Missing required files in dist/:", missing.join(", "));
  process.exit(1);
}

console.log("[build] dist/ verified:", required.join(", "));
