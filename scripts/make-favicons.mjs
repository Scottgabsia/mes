import { Jimp } from "jimp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const publicDir = path.join(root, "public");

const srcPath =
  process.argv[2] ||
  path.join(root, "../.cursor/projects/Users-dopesmush-Downloads-mes-main/assets/favicon-icon.png");

function isBackground(hex) {
  const { r, g, b } = hex;
  if (Math.abs(r - g) < 25 && Math.abs(g - b) < 25) {
    if (r > 160) return true;
    if (r > 40 && r < 210) return true;
  }
  if (r < 45 && g < 55 && b < 90) return true;
  return false;
}

async function makeTransparent(image) {
  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      if (isBackground({ r, g, b })) {
        this.bitmap.data[idx + 3] = 0;
      }
    }
  );
  return image;
}

function cropToContent(image) {
  let minX = image.bitmap.width;
  let minY = image.bitmap.height;
  let maxX = 0;
  let maxY = 0;

  image.scan(
    0,
    0,
    image.bitmap.width,
    image.bitmap.height,
    function (x, y, idx) {
      if (this.bitmap.data[idx + 3] > 20) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  );

  if (maxX <= minX || maxY <= minY) return image;
  return image.crop({
    x: minX,
    y: minY,
    w: maxX - minX + 1,
    h: maxY - minY + 1,
  });
}

async function writeIcon(image, size, filename) {
  const canvas = new Jimp({ width: size, height: size, color: 0x00000000 });
  const icon = image.clone().contain({ w: size, h: size });
  const x = Math.floor((size - icon.bitmap.width) / 2);
  const y = Math.floor((size - icon.bitmap.height) / 2);
  canvas.composite(icon, x, y);
  await canvas.write(path.join(publicDir, filename));
}

let img = await Jimp.read(srcPath);
img = await makeTransparent(img);
img = cropToContent(img);

await writeIcon(img, 32, "favicon-32x32.png");
await writeIcon(img, 192, "favicon-192x192.png");
await writeIcon(img, 180, "apple-touch-icon.png");

const logoPath = path.join(publicDir, "logo.png");
try {
  let logo = await Jimp.read(logoPath);
  logo = await makeTransparent(logo);
  await logo.write(logoPath);
  console.log("Updated logo.png transparency");
} catch {
  /* optional */
}

console.log("Favicons written to public/");
