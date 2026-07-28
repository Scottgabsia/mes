/**
 * After Vite build: write per-route index.html shells so crawlers get unique
 * titles, meta, JSON-LD, and noscript text without executing JavaScript.
 * Run: tsx scripts/prerender-seo-shells.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { BLOG_SLUGS, FEATURED_BLOG_POSTS, getBlogPostBySlug } from "../src/data/blogPosts";
import { SEO_ROUTES, getSeoForPath } from "../src/lib/seoConfig";
import { SITE_URL } from "../src/constants";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distPath = path.join(root, "dist");
const baseIndex = path.join(distPath, "index.html");

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 600);
}

function buildJsonLd(pathname: string): Record<string, unknown>[] {
  const schemas: Record<string, unknown>[] = [];
  const canonical =
    pathname === "/" ? `${SITE_URL}/` : `${SITE_URL}${pathname}`;

  if (pathname === "/") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Crypto Recovery Assets",
      url: `${SITE_URL}/`,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/faq?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      name: "Crypto Recovery Assets",
      url: `${SITE_URL}/`,
      telephone: "+1-401-684-4683",
      email: "info@cryptorecoveryasset.com",
    });
  }

  const blogMatch = pathname.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = getBlogPostBySlug(blogMatch[1]!);
    if (post) {
      schemas.push({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        author: { "@type": "Person", name: post.author },
        datePublished: post.date,
        mainEntityOfPage: canonical,
        publisher: {
          "@type": "Organization",
          name: "Crypto Recovery Assets",
          logo: `${SITE_URL}/brand-icon-512.png`,
        },
      });
    }
  }

  schemas.push({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: buildBreadcrumbs(pathname).map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.href,
    })),
  });

  return schemas;
}

function buildBreadcrumbs(pathname: string): { name: string; href: string }[] {
  const items = [{ name: "Home", href: `${SITE_URL}/` }];
  if (pathname === "/") return items;

  const parts = pathname.split("/").filter(Boolean);
  let acc = "";
  for (const part of parts) {
    acc += `/${part}`;
    if (part === "blog" && parts.length === 1) {
      items.push({ name: "Blog", href: `${SITE_URL}/blog` });
      break;
    }
    if (parts[0] === "blog" && part !== "blog") {
      const post = getBlogPostBySlug(part);
      items.push({ name: "Blog", href: `${SITE_URL}/blog` });
      if (post) items.push({ name: post.title, href: `${SITE_URL}${acc}` });
      break;
    }
    const route = SEO_ROUTES.find((r) => r.path === acc);
    items.push({
      name: route?.title.split("|")[0]?.trim() ?? part,
      href: `${SITE_URL}${acc}`,
    });
  }
  return items;
}

function buildNavLinks(): string {
  const main = SEO_ROUTES.filter(
    (r) => !["/privacy", "/terms"].includes(r.path) && r.priority && r.priority >= 0.7
  )
    .slice(0, 12)
    .map(
      (r) =>
        `<li><a href="${SITE_URL}${r.path === "/" ? "/" : r.path}">${escapeHtml(r.title)}</a></li>`
    )
    .join("\n");

  const recentBlogs = FEATURED_BLOG_POSTS.slice(0, 8)
    .map(
      (p) =>
        `<li><a href="${SITE_URL}/blog/${p.slug}">${escapeHtml(p.title)}</a></li>`
    )
    .join("\n");

  return `<nav aria-label="Site map">
    <h2>Main pages</h2>
    <ul>${main}</ul>
    <h2>Recent articles</h2>
    <ul>${recentBlogs}</ul>
    <p><a href="${SITE_URL}/sitemap.xml">XML sitemap</a></p>
  </nav>`;
}

function injectSeo(
  html: string,
  opts: {
    title: string;
    description: string;
    keywords?: string;
    canonical: string;
    pathname: string;
    bodyHtml: string;
    noindex?: boolean;
  }
): string {
  const fullTitle = `${opts.title} | Crypto Recovery Assets`;
  const robots = opts.noindex
    ? "noindex, nofollow"
    : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

  let out = html;
  out = out.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);
  out = out.replace(
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(opts.description)}" />`
  );

  if (!out.includes('name="robots"')) {
    out = out.replace(
      /<meta charset="UTF-8"\s*\/?>/i,
      `<meta charset="UTF-8" />\n    <meta name="robots" content="${robots}" />\n    <meta name="googlebot" content="${robots}" />`
    );
  } else {
    out = out.replace(
      /<meta name="robots" content="[^"]*"\s*\/?>/i,
      `<meta name="robots" content="${robots}" />`
    );
  }

  const headInject = `
    <link rel="canonical" href="${escapeHtml(opts.canonical)}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(opts.description)}" />
    <meta property="og:url" content="${escapeHtml(opts.canonical)}" />
    ${opts.keywords ? `<meta name="keywords" content="${escapeHtml(opts.keywords)}" />` : ""}
    ${buildJsonLd(opts.pathname)
      .map(
        (s) =>
          `<script type="application/ld+json">${JSON.stringify(s)}</script>`
      )
      .join("\n    ")}
  `;

  out = out.replace("</head>", `${headInject}\n  </head>`);

  const noscript = `
    <noscript>
      <main id="crawler-content" style="max-width:720px;margin:2rem auto;padding:0 1rem;font-family:system-ui,sans-serif;color:#111;">
        ${opts.bodyHtml}
        ${buildNavLinks()}
      </main>
    </noscript>`;

  out = out.replace("<div id=\"root\"></div>", `${noscript}\n    <div id="root"></div>`);
  return out;
}

function writeShell(pathname: string, bodyHtml: string, noindex = false): void {
  const seo = getSeoForPath(pathname);
  const html = injectSeo(baseTemplate, {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    canonical: seo.canonical,
    pathname,
    bodyHtml,
    noindex: noindex || seo.noindex,
  });

  if (pathname === "/") {
    fs.writeFileSync(baseIndex, html);
    return;
  }

  const relDir = pathname.replace(/^\//, "");
  const outDir = path.join(distPath, relDir);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "index.html"), html);
}

if (!fs.existsSync(baseIndex)) {
  console.error("[prerender] Missing dist/index.html — run vite build first.");
  process.exit(1);
}

const baseTemplate = fs.readFileSync(baseIndex, "utf8");

let count = 0;

const routePaths = SEO_ROUTES.map((r) => r.path).filter((p) => !p.startsWith("/admin"));
const orderedRoutes = [...routePaths.filter((p) => p !== "/"), ...routePaths.filter((p) => p === "/")];

for (const routePath of orderedRoutes) {
  const route = SEO_ROUTES.find((r) => r.path === routePath)!;
  const body = `<h1>${escapeHtml(route.title)}</h1><p>${escapeHtml(route.description)}</p>`;
  writeShell(routePath, body);
  count++;
}

for (const slug of BLOG_SLUGS) {
  const post = getBlogPostBySlug(slug);
  if (!post) continue;
  const snippet = stripMarkdown(post.content || post.excerpt);
  const body = `<h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt)}</p><p>${escapeHtml(snippet)}</p>`;
  writeShell(`/blog/${slug}`, body);
  count++;
}

console.log(`[prerender] Wrote ${count} SEO shells to dist/`);
