import { FIREBASE_API_URL } from "../constants";

const envBase =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "";

function buildUrl(base: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Try same-origin first, then optional Firebase fallback */
function getApiBases(): string[] {
  const bases: string[] = [];
  if (envBase) bases.push(envBase);
  bases.push(""); // same-origin — localhost dev or Hostinger Node
  const firebase = FIREBASE_API_URL.replace(/\/$/, "");
  if (firebase && !bases.includes(firebase)) bases.push(firebase);
  return bases;
}

export function apiUrl(path: string): string {
  return buildUrl(getApiBases()[0] ?? "", path);
}

export async function isApiOnline(): Promise<boolean> {
  for (const base of getApiBases()) {
    try {
      const res = await fetch(buildUrl(base, "/api/health"), { method: "GET" });
      const type = res.headers.get("content-type") || "";
      if (res.ok && type.includes("application/json")) return true;
    } catch {
      /* try next */
    }
  }
  return false;
}

export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<{ ok: boolean; data: T | null; error?: string }> {
  let lastError = "Email API unavailable";

  for (const base of getApiBases()) {
    const url = buildUrl(base, path);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        lastError = "API returned HTML (static hosting — no email server)";
        continue;
      }

      const data = (await res.json()) as T;
      return { ok: res.ok, data };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  return { ok: false, data: null, error: lastError };
}
