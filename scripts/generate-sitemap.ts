/**
 * Regenerate public/sitemap.xml + sitemap-images.xml from SEO_ROUTES + BLOG_SLUGS.
 * Run: tsx scripts/generate-sitemap.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BLOG_SLUGS, FEATURED_BLOG_POSTS } from "../src/data/blogPosts";
import { SEO_ROUTES } from "../src/lib/seoConfig";
import { SITE_URL } from "../src/constants";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const base = SITE_URL.replace(/\/$/, "");
const today = new Date().toISOString().slice(0, 10);

function parseBlogLastmod(dateStr: string): string {
  const parsed = Date.parse(dateStr);
  if (Number.isNaN(parsed)) return today;
  return new Date(parsed).toISOString().slice(0, 10);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

type UrlEntry = {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
};

const urls: UrlEntry[] = SEO_ROUTES.map((route) => ({
  loc: route.path === "/" ? `${base}/` : `${base}${route.path}`,
  lastmod: today,
  changefreq: route.changefreq ?? "monthly",
  priority: String(route.priority ?? 0.5),
}));

const blogBySlug = new Map(FEATURED_BLOG_POSTS.map((p) => [p.slug, p]));

for (const slug of BLOG_SLUGS) {
  const post = blogBySlug.get(slug);
  urls.push({
    loc: `${base}/blog/${slug}`,
    lastmod: post ? parseBlogLastmod(post.date) : today,
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
    <lastmod>${u.lastmod}</lastmod>
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

const imageUrls = FEATURED_BLOG_POSTS.filter((p) => p.image?.startsWith("/blog/")).map((p) => {
  const img = p.image.startsWith("http") ? p.image : `${base}${p.image}`;
  return `  <url>
    <loc>${base}/blog/${p.slug}</loc>
    <image:image>
      <image:loc>${img}</image:loc>
      <image:title>${escapeXml(p.title)}</image:title>
      <image:caption>${escapeXml(p.excerpt.slice(0, 200))}</image:caption>
    </image:image>
  </url>`;
});

const imageXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrls.join("\n")}
</urlset>
`;

const imageOut = path.join(root, "public", "sitemap-images.xml");
fs.writeFileSync(imageOut, imageXml);
console.log(`Wrote ${imageOut} (${imageUrls.length} image URLs)`);
