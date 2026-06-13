/**
 * Writes HTML previews for all marketing templates to public/email-previews/
 * Run: npm run email:previews
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { listMarketingTemplates, buildMarketingEmail } from "../server/marketingEmails";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "../public/email-previews");

const sampleVars = {
  firstName: "Alex",
  caseId: "DF-8829-QX-04",
};

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const indexRows: string[] = [];

for (const template of listMarketingTemplates()) {
  const { html, subject } = buildMarketingEmail(template.id, sampleVars);
  const filename = `${template.id}.html`;
  fs.writeFileSync(path.join(outDir, filename), html, "utf8");
  indexRows.push(
    `<li><a href="./${filename}"><strong>${template.name}</strong></a> — ${subject}</li>`
  );
  console.log(`Wrote ${filename}`);
}

const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Marketing email previews — Crypto Recovery Asset</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; }
    li { margin: 12px 0; }
    a { color: #2563eb; }
  </style>
</head>
<body>
  <h1>Marketing email previews</h1>
  <p>Sample data: firstName Alex, caseId DF-8829-QX-04. Regenerate with <code>npm run email:previews</code>.</p>
  <ul>${indexRows.join("\n")}</ul>
</body>
</html>`;

fs.writeFileSync(path.join(outDir, "index.html"), indexHtml, "utf8");
console.log("Wrote index.html");
