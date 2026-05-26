import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const staticDir = path.join(root, "dist", "browser");
const serverFile = path.join(root, "dist", "server.cjs");
const rootFiles = ["app.cjs"];

const missingRoot = rootFiles.filter((file) => !fs.existsSync(path.join(root, file)));
const missingStatic = ["index.html"].filter(
  (file) => !fs.existsSync(path.join(staticDir, file))
);
const missingServer = fs.existsSync(serverFile) ? [] : ["dist/server.cjs"];

if (missingRoot.length || missingStatic.length || missingServer.length) {
  if (missingRoot.length) console.error("[build] Missing at repo root:", missingRoot.join(", "));
  if (missingStatic.length) console.error("[build] Missing in dist/browser/:", missingStatic.join(", "));
  if (missingServer.length) console.error("[build] Missing:", missingServer.join(", "));
  process.exit(1);
}

console.log("[build] OK: app.cjs, dist/server.cjs, dist/browser/index.html");
