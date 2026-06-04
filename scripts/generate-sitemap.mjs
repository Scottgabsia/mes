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
const blogSlugs = [
  "crypto-asset-protection-scam-help-support-guide",
  "recover-lost-cryptocurrency-blockchain-assets-guide",
  "crypto-fraud-blockchain-recovery-investigation-guide",
  "exchange-compliance-digital-asset-recovery-guide",
  "recover-hacked-crypto-wallet-complete-guide",
  "legit-trusted-crypto-recovery-company-guide",
  "crypto-scam-investigation-tracing-services-guide",
  "blockchain-forensic-analysis-crypto-recovery-guide",
  "bitcoin-ethereum-recovery-specialists-guide",
  "crypto-recovery-services-complete-guide-2026",
  "crypto-recovery-mountain-plains-usa-states-cities",
  "crypto-recovery-west-coast-usa-states-cities",
  "crypto-recovery-south-texas-usa-states-cities",
  "crypto-recovery-midwest-usa-states-cities",
  "crypto-recovery-northeast-usa-states-cities",
  "crypto-recovery-services-usa-guide-2026",
  "crypto-legal-reporting-review-court-ready-forensic-documentation",
  "defi-smart-contract-exploit-recovery-review-long-analysis",
  "exchange-compliance-crypto-recovery-review-kyc-aml-freeze-workflow",
  "bitcoin-recovery-case-review-long-investigation-breakdown",
  "crypto-recovery-service-reviews-2026-long-guide",
  "legal-evidence-in-crypto-recovery-court-ready-reports",
  "chain-hopping-and-mixers-how-scammers-launder-crypto",
  "smart-contract-exploits-can-lost-tokens-be-recovered",
  "role-of-exchange-compliance-in-crypto-recovery",
  "how-blockchain-forensics-trace-stolen-crypto-across-wallets",
  "future-of-crypto-security-ai-forensics-regulation",
  "crypto-recovery-vs-scam-recovery-difference",
  "inside-bitcoin-recovery-case-blockchain-forensics",
  "five-things-to-do-immediately-after-crypto-scam",
  "can-stolen-crypto-be-recovered-victim-guide",
  "cryptocurrency-recovery-service-guide",
  "fake-crypto-investment-scam-recovery",
  "blockchain-forensics-crypto-recovery",
  "lost-crypto-wallet-recovery-guide",
  "sim-swap-crypto-theft-recovery",
  "stolen-usdt-recovery-guide-2026",
  "how-to-recover-stolen-bitcoin-2026",
  "best-crypto-recovery-company-guide",
  "recover-hacked-crypto-wallet-guide",
  "crypto-scam-recovery-what-works",
  "digital-asset-recovery-explained",
  "top-10-crypto-scams-2026",
];

const routes = [
  ["/", "weekly", "1.0"],
  ["/services", "monthly", "0.9"],
  ["/contact", "monthly", "0.95"],
  ["/about", "monthly", "0.8"],
  ["/faq", "weekly", "0.85"],
  ["/reviews", "weekly", "0.8"],
  ["/blog", "weekly", "0.75"],
  ...blogSlugs.map((slug) => [`/blog/${slug}`, "monthly", "0.72"]),
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
