/**
 * Regenerate public/sitemap.xml from SEO_ROUTES + BLOG_SLUGS (single source of truth).
 * Run: tsx scripts/generate-sitemap.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BLOG_SLUGS } from "../src/data/blogPosts";
import { SEO_ROUTES } from "../src/lib/seoConfig";
import { SITE_URL } from "../src/constants";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const base = SITE_URL.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

type UrlEntry = {
  loc: string;
  changefreq: string;
  priority: string;
};

const urls: UrlEntry[] = SEO_ROUTES.map((route) => ({
  loc: route.path === "/" ? `${base}/` : `${base}${route.path}`,
  changefreq: route.changefreq ?? "monthly",
  priority: String(route.priority ?? 0.5),
}));

for (const slug of BLOG_SLUGS) {
  urls.push({
    loc: `${base}/blog/${slug}`,
    changefreq: "monthly",
    priority: "0.72",
  });
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

const out = path.join(root, "public", "sitemap.xml");
fs.writeFileSync(out, xml);
console.log(`Wrote ${out} (${urls.length} URLs)`);
