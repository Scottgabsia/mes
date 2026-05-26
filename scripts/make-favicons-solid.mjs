import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const srcPath = process.argv[2];
if (!srcPath) {
  console.error("Usage: node scripts/make-favicons-solid.mjs <source-image>");
  process.exit(1);
}

/** Dark navy from source image edges — keeps favicon matching the artwork */
const BG_COLOR = 0x0a1020ff;

async function writeSquareIcon(image, size, filename) {
  const canvas = new Jimp({ width: size, height: size, color: BG_COLOR });
  const fitted = image.clone().contain({ w: size, h: size });
  const x = Math.floor((size - fitted.bitmap.width) / 2);
  const y = Math.floor((size - fitted.bitmap.height) / 2);
  canvas.composite(fitted, x, y);
  await canvas.write(path.join(publicDir, filename));
}

const img = await Jimp.read(srcPath);

await writeSquareIcon(img, 32, "favicon-32x32.png");
await writeSquareIcon(img, 192, "favicon-192x192.png");
await writeSquareIcon(img, 180, "apple-touch-icon.png");

console.log("Solid-background favicons written to public/");
