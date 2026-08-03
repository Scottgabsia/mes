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

const sampleShell = path.join(dist, "blog", "index.html");
const servicesShell = path.join(dist, "services", "index.html");
if (!fs.existsSync(sampleShell) && !fs.existsSync(servicesShell)) {
  console.error("[build] Missing prerender SEO shells — run prerender-seo-shells.ts after vite build");
  process.exit(1);
}

const indexNowKey = "3ef70e5fa77e6c5c243d32496fe3f858.txt";
const indexNowInPublic = path.join(root, "public", indexNowKey);
const indexNowInDist = path.join(dist, indexNowKey);
if (!fs.existsSync(indexNowInPublic)) {
  console.error("[build] Missing IndexNow key file in public/:", indexNowKey);
  process.exit(1);
}
if (fs.existsSync(dist) && fs.existsSync(path.join(dist, "index.html")) && !fs.existsSync(indexNowInDist)) {
  console.warn("[build] IndexNow key not found in dist/ yet — ensure vite copies public/ assets");
}

console.log("[build] OK:", [...rootFiles, ...required.map((f) => `dist/${f}`)].join(", "));
console.log("[build] IndexNow key file present:", indexNowKey);
