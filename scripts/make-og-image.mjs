import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");
const srcPath = process.argv[2];

if (!srcPath) {
  console.error("Usage: node scripts/make-og-image.mjs <source-image>");
  process.exit(1);
}

const BG_COLOR = 0x0a1020ff;
const W = 1200;
const H = 630;

const img = await Jimp.read(srcPath);
const canvas = new Jimp({ width: W, height: H, color: BG_COLOR });
const fitted = img.clone().contain({ w: Math.floor(W * 0.92), h: Math.floor(H * 0.92) });
const x = Math.floor((W - fitted.bitmap.width) / 2);
const y = Math.floor((H - fitted.bitmap.height) / 2);
canvas.composite(fitted, x, y);

const out = path.join(publicDir, "og-image.png");
await canvas.write(out);
console.log("Wrote", out, `${W}x${H}`);
