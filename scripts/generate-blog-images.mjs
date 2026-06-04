/**
 * Branded blog hero images (1200×675) for SEO posts.
 * Run: node scripts/generate-blog-images.mjs
 */
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const blogDir = path.join(__dirname, "..", "public", "blog");

const BG = 0x0b1220ff;
const BLUE = 0x2563ebff;
const CYAN = 0x38bdf8ff;
const W = 1200;
const H = 675;

function blend(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function drawGradient(img) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const t = y / H;
      const r = blend(0x0b, 0x1e, t);
      const g = blend(0x12, 0x3a, t);
      const b = blend(0x20, 0x8f, t);
      img.setPixelColor(((r << 24) | (g << 16) | (b << 8) | 0xff) >>> 0, x, y);
    }
  }
}

function drawGlow(img, cx, cy, radius, color) {
  const r = (color >> 24) & 0xff;
  const g = (color >> 16) & 0xff;
  const b = (color >> 8) & 0xff;
  for (let y = Math.max(0, cy - radius); y < Math.min(H, cy + radius); y++) {
    for (let x = Math.max(0, cx - radius); x < Math.min(W, cx + radius); x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (d > radius) continue;
      const alpha = (1 - d / radius) * 0.35;
      const existing = img.getPixelColor(x, y);
      const er = (existing >> 24) & 0xff;
      const eg = (existing >> 16) & 0xff;
      const eb = (existing >> 8) & 0xff;
      const nr = Math.min(255, Math.round(er + r * alpha));
      const ng = Math.min(255, Math.round(eg + g * alpha));
      const nb = Math.min(255, Math.round(eb + b * alpha));
      img.setPixelColor(((nr << 24) | (ng << 16) | (nb << 8) | 0xff) >>> 0, x, y);
    }
  }
}

function drawLine(img, x0, y0, x1, y1, color, thickness = 2) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = Math.round(x0 + (x1 - x0) * t);
    const y = Math.round(y0 + (y1 - y0) * t);
    for (let dy = -thickness; dy <= thickness; dy++) {
      for (let dx = -thickness; dx <= thickness; dx++) {
        const px = x + dx;
        const py = y + dy;
        if (px >= 0 && px < W && py >= 0 && py < H) {
          img.setPixelColor(color, px, py);
        }
      }
    }
  }
}

async function createCover(slug, accent) {
  const img = new Jimp({ width: W, height: H, color: BG });
  drawGradient(img);

  const nodes = [
    [180, 320],
    [380, 180],
    [620, 260],
    [860, 140],
    [1020, 340],
    [740, 420],
    [480, 480],
  ];

  for (const [x, y] of nodes) drawGlow(img, x, y, 90, accent);

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [2, 5],
    [5, 6],
    [1, 6],
  ];
  for (const [a, b] of edges) {
    const [x0, y0] = nodes[a];
    const [x1, y1] = nodes[b];
    drawLine(img, x0, y0, x1, y1, (CYAN & 0xffffff00) | 0x88, 2);
  }

  for (const [x, y] of nodes) {
    drawGlow(img, x, y, 18, accent);
    for (let dy = -6; dy <= 6; dy++) {
      for (let dx = -6; dx <= 6; dx++) {
        if (dx * dx + dy * dy <= 36) {
          img.setPixelColor(0xffffffff, x + dx, y + dy);
        }
      }
    }
  }

  // Accent bar
  for (let y = H - 8; y < H; y++) {
    for (let x = 0; x < W; x++) {
      img.setPixelColor(accent >>> 0, x, y);
    }
  }

  const out = path.join(blogDir, `${slug}.png`);
  await img.write(out);
  console.log("Wrote", out);
}

fs.mkdirSync(blogDir, { recursive: true });

const covers = [
  ["crypto-recovery-services-complete-guide-2026", 0x2563ebff],
  ["bitcoin-ethereum-recovery-specialists-guide", 0xeab308ff],
  ["blockchain-forensic-analysis-crypto-recovery-guide", 0x22d3eeff],
  ["crypto-scam-investigation-tracing-services-guide", 0x0891b2ff],
  ["legit-trusted-crypto-recovery-company-guide", 0x059669ff],
  ["recover-hacked-crypto-wallet-complete-guide", 0x7c3aedff],
  ["exchange-compliance-digital-asset-recovery-guide", 0x0ea5e9ff],
  ["crypto-fraud-blockchain-recovery-investigation-guide", 0xef4444ff],
  ["recover-lost-cryptocurrency-blockchain-assets-guide", 0x6366f1ff],
  ["crypto-asset-protection-scam-help-support-guide", 0x14b8a6ff],
  ["crypto-recovery-services-usa-guide-2026", 0x1d4ed8ff],
  ["crypto-recovery-northeast-usa-states-cities", 0x0ea5e9ff],
  ["crypto-recovery-midwest-usa-states-cities", 0x6366f1ff],
  ["crypto-recovery-south-texas-usa-states-cities", 0xf97316ff],
  ["crypto-recovery-west-coast-usa-states-cities", 0x22c55eff],
  ["crypto-recovery-mountain-plains-usa-states-cities", 0xa855f7ff],
  ["crypto-recovery-service-reviews-2026-long-guide", 0x2563ebff],
  ["bitcoin-recovery-case-review-long-investigation-breakdown", 0xeab308ff],
  ["exchange-compliance-crypto-recovery-review-kyc-aml-freeze-workflow", 0x06b6d4ff],
  ["defi-smart-contract-exploit-recovery-review-long-analysis", 0x9333eaff],
  ["crypto-legal-reporting-review-court-ready-forensic-documentation", 0x14b8a6ff],
  ["how-blockchain-forensics-trace-stolen-crypto-across-wallets", 0x22c55eff],
  ["role-of-exchange-compliance-in-crypto-recovery", 0x0ea5e9ff],
  ["smart-contract-exploits-can-lost-tokens-be-recovered", 0xa855f7ff],
  ["chain-hopping-and-mixers-how-scammers-launder-crypto", 0xef4444ff],
  ["legal-evidence-in-crypto-recovery-court-ready-reports", 0x14b8a6ff],
  ["can-stolen-crypto-be-recovered-victim-guide", 0x0ea5e9ff],
  ["five-things-to-do-immediately-after-crypto-scam", 0x16a34aff],
  ["inside-bitcoin-recovery-case-blockchain-forensics", 0xeab308ff],
  ["crypto-recovery-vs-scam-recovery-difference", 0xf97316ff],
  ["future-of-crypto-security-ai-forensics-regulation", 0x8b5cf6ff],
  ["how-to-recover-stolen-bitcoin-2026", BLUE],
  ["best-crypto-recovery-company-guide", 0x059669ff],
  ["recover-hacked-crypto-wallet-guide", 0x7c3aedff],
  ["crypto-scam-recovery-what-works", 0x0891b2ff],
  ["operation-gilded-cage-pig-butchering-recovery", 0xdc2626ff],
  ["stolen-usdt-recovery-guide-2026", 0x059669ff],
  ["sim-swap-crypto-theft-recovery", 0xea580cff],
  ["lost-crypto-wallet-recovery-guide", 0x6366f1ff],
  ["blockchain-forensics-crypto-recovery", CYAN],
  ["fake-crypto-investment-scam-recovery", 0xb45309ff],
  ["cryptocurrency-recovery-service-guide", BLUE],
  ["top-10-crypto-scams-2026", 0xf97316ff],
  ["digital-asset-recovery-explained", 0x8b5cf6ff],
];

for (const [slug, accent] of covers) {
  await createCover(slug, accent);
}
