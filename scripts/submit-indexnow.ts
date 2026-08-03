/**
 * IndexNow — notify Bing, Yandex, Seznam, Naver, Yep, Amazon of URL updates.
 *
 * Setup:
 * 1. Key file must be live at: https://cryptorecoveryasset.com/{INDEXNOW_KEY}.txt
 * 2. After deploy: npm run indexnow
 *
 * Docs: https://www.indexnow.org/documentation
 */
import { BLOG_SLUGS } from "../src/data/blogPosts";
import { SEO_ROUTES } from "../src/lib/seoConfig";
import { INDEXNOW_KEY, INDEXNOW_KEY_LOCATION, SITE_URL } from "../src/constants";

const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 100; // stay well under the 10,000 URL limit

function collectUrls(): string[] {
  const base = SITE_URL.replace(/\/$/, "");
  const urls = SEO_ROUTES.map((route) =>
    route.path === "/" ? `${base}/` : `${base}${route.path}`
  );
  for (const slug of BLOG_SLUGS) {
    urls.push(`${base}/blog/${slug}`);
  }
  return [...new Set(urls)];
}

async function submitBatch(urlList: string[]): Promise<{ ok: boolean; status: number; body: string }> {
  const host = new URL(SITE_URL).host;
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host,
      key: INDEXNOW_KEY,
      keyLocation: INDEXNOW_KEY_LOCATION,
      urlList,
    }),
  });
  const body = await res.text();
  return { ok: res.ok || res.status === 202, status: res.status, body };
}

async function main() {
  if (!INDEXNOW_KEY || INDEXNOW_KEY.length < 8) {
    console.error("[indexnow] Missing INDEXNOW_KEY in constants");
    process.exit(1);
  }

  // Verify key file is reachable (must be deployed)
  try {
    const keyRes = await fetch(INDEXNOW_KEY_LOCATION, { method: "GET" });
    const keyBody = (await keyRes.text()).trim();
    if (!keyRes.ok || keyBody !== INDEXNOW_KEY) {
      console.error(
        `[indexnow] Key file not verified at ${INDEXNOW_KEY_LOCATION} (HTTP ${keyRes.status}). Deploy the site first, then re-run npm run indexnow.`
      );
      process.exit(1);
    }
    console.log(`[indexnow] Key file OK: ${INDEXNOW_KEY_LOCATION}`);
  } catch (err) {
    console.error("[indexnow] Could not reach key file — deploy first:", err);
    process.exit(1);
  }

  const urls = collectUrls();
  console.log(`[indexnow] Submitting ${urls.length} URLs to ${ENDPOINT}`);

  let submitted = 0;
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE);
    const result = await submitBatch(batch);
    if (!result.ok) {
      console.error(
        `[indexnow] Batch ${i / BATCH_SIZE + 1} failed HTTP ${result.status}: ${result.body.slice(0, 300)}`
      );
      process.exit(1);
    }
    submitted += batch.length;
    console.log(
      `[indexnow] Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} URLs → HTTP ${result.status}`
    );
  }

  console.log(`[indexnow] Done. Submitted ${submitted} URLs.`);

  // Also ping major engines with the sitemap URL (complements IndexNow)
  const sitemapUrl = encodeURIComponent(`${SITE_URL.replace(/\/$/, "")}/sitemap.xml`);
  const pings = [
    `https://www.bing.com/indexnow?url=${encodeURIComponent(`${SITE_URL}/`)}&key=${INDEXNOW_KEY}`,
    `https://www.google.com/ping?sitemap=${sitemapUrl}`,
  ];
  for (const ping of pings) {
    try {
      const res = await fetch(ping, { method: "GET" });
      console.log(`[indexnow] Discovery ping ${new URL(ping).host} → HTTP ${res.status}`);
    } catch (err) {
      console.warn(`[indexnow] Ping failed for ${ping}:`, err);
    }
  }
}

main().catch((err) => {
  console.error("[indexnow] Fatal:", err);
  process.exit(1);
});
