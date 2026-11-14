/**
 * Build square, solid-background favicons for browsers and Google Search.
 * Google recommends ≥48×48, 1:1, crawlable /favicon.ico or rel="icon".
 */
import { Jimp } from "jimp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/** Build a multi-size ICO from PNG buffers without the unmaintained to-ico tree. */
function pngsToIco(pngBuffers) {
  const count = pngBuffers.length;
  const headerSize = 6 + 16 * count;
  let offset = headerSize;
  const entries = pngBuffers.map((buf) => {
    const entry = { buf, offset, size: buf.length };
    offset += buf.length;
    return entry;
  });
  const out = Buffer.alloc(offset);
  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(count, 4);
  let pos = 6;
  for (const entry of entries) {
    const width = entry.buf.readUInt32BE(16);
    const height = entry.buf.readUInt32BE(20);
    out[pos] = width >= 256 ? 0 : width;
    out[pos + 1] = height >= 256 ? 0 : height;
    out[pos + 2] = 0;
    out[pos + 3] = 0;
    out.writeUInt16LE(1, pos + 4);
    out.writeUInt16LE(32, pos + 6);
    out.writeUInt32LE(entry.size, pos + 8);
    out.writeUInt32LE(entry.offset, pos + 12);
    pos += 16;
  }
  for (const entry of entries) {
    entry.buf.copy(out, entry.offset);
  }
  return out;
}

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
await fs.promises.writeFile(path.join(publicDir, "favicon.ico"), pngsToIco(icoBuffers));

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
