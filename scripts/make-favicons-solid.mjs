/**
 * Build square, solid-background favicons for browsers and Google Search.
 * Google recommends ≥48×48, 1:1, crawlable /favicon.ico or rel="icon".
 */
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import toIco from "to-ico";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, "..", "public");

const srcPath = process.argv[2] || path.join(publicDir, "logo.png");
/** Dark navy — visible on Google’s white results UI */
const BG_COLOR = 0x0a1020ff;

async function writeSquareIcon(image, size, filename) {
  const canvas = new Jimp({ width: size, height: size, color: BG_COLOR });
  const fitted = image.clone().contain({ w: Math.floor(size * 0.88), h: Math.floor(size * 0.88) });
  const x = Math.floor((size - fitted.bitmap.width) / 2);
  const y = Math.floor((size - fitted.bitmap.height) / 2);
  canvas.composite(fitted, x, y);
  await canvas.write(path.join(publicDir, filename));
}

const img = await Jimp.read(srcPath);

const sizes = [
  [16, "favicon-16x16.png"],
  [32, "favicon-32x32.png"],
  [48, "favicon-48x48.png"],
  [96, "favicon-96x96.png"],
  [180, "apple-touch-icon.png"],
  [192, "favicon-192x192.png"],
  [512, "brand-icon-512.png"],
];

for (const [size, name] of sizes) {
  await writeSquareIcon(img, size, name);
}

const icoBuffers = await Promise.all(
  [16, 32, 48].map(async (size) =>
    fs.promises.readFile(path.join(publicDir, `favicon-${size}x${size}.png`))
  )
);
await fs.promises.writeFile(path.join(publicDir, "favicon.ico"), await toIco(icoBuffers));

const manifest = {
  name: "Crypto Recovery Assets",
  short_name: "CRA",
  icons: [
    { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
    { src: "/brand-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
  ],
  theme_color: "#0a1020",
  background_color: "#0a1020",
  display: "standalone",
};

await fs.promises.writeFile(
  path.join(publicDir, "site.webmanifest"),
  JSON.stringify(manifest, null, 2)
);

console.log("Favicons + favicon.ico + site.webmanifest written to public/");
