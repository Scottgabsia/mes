/**
 * Regenerate public/sitemap.xml from src/lib/seoConfig routes.
 * Run: node scripts/generate-sitemap.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

// Read SEO_ROUTES from built file is hard in plain node — duplicate paths inline from config
const routes = [
  ["/", "weekly", "1.0"],
  ["/services", "monthly", "0.9"],
  ["/contact", "monthly", "0.95"],
  ["/about", "monthly", "0.8"],
  ["/faq", "weekly", "0.85"],
  ["/reviews", "weekly", "0.8"],
  ["/blog", "weekly", "0.75"],
  ["/intelligence", "weekly", "0.75"],
  ["/case-lookup", "monthly", "0.7"],
  ["/traceability", "monthly", "0.8"],
  ["/recovery", "monthly", "0.8"],
  ["/legal", "monthly", "0.75"],
  ["/risk", "monthly", "0.7"],
  ["/tools", "monthly", "0.75"],
  ["/privacy", "yearly", "0.3"],
  ["/terms", "yearly", "0.3"],
  ["/iso27001", "yearly", "0.4"],
  ["/soc2", "yearly", "0.4"],
  ["/gdpr", "yearly", "0.4"],
  ["/amlkyc", "yearly", "0.4"],
];

const today = new Date().toISOString().slice(0, 10);
const base = "https://cryptorecoveryasset.com";

const urls = routes
  .map(([p, freq, priority]) => {
    const loc = p === "/" ? `${base}/` : `${base}${p}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${freq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

const out = path.join(root, "public", "sitemap.xml");
fs.writeFileSync(out, xml);
console.log(`Wrote ${out} (${routes.length} URLs)`);
