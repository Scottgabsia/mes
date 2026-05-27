import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const required = ["index.html", "server.cjs"];
const rootFiles = ["app.cjs"];

const missingRoot = rootFiles.filter((file) => !fs.existsSync(path.join(root, file)));

const missing = required.filter((file) => !fs.existsSync(path.join(dist, file)));

if (missing.length || missingRoot.length) {
  if (missing.length) console.error("[build] Missing in dist/:", missing.join(", "));
  if (missingRoot.length) console.error("[build] Missing at repo root:", missingRoot.join(", "));
  process.exit(1);
}

const serverBundle = fs.readFileSync(path.join(dist, "server.cjs"), "utf8");
const requiredRoutes = [
  "/api/submit-recovery",
  "/api/case-lookup",
  "/api/case/",
  "/api/admin/cases",
  "keyphrase",
];
const missingRoutes = requiredRoutes.filter((r) => !serverBundle.includes(r));

if (missingRoutes.length) {
  console.error("[build] Server bundle missing routes:", missingRoutes.join(", "));
  process.exit(1);
}

console.log("[build] OK:", [...rootFiles, ...required.map((f) => `dist/${f}`)].join(", "));
