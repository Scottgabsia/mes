import { FIREBASE_API_URL } from "../constants";

const envBase =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ??
  "";

function buildUrl(base: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/** Same-origin (Hostinger Node) first — case store + admin API live there. */
export function getApiBases(): string[] {
  const bases: string[] = [""];
  if (envBase && !bases.includes(envBase)) bases.push(envBase);
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

/** GET/PATCH/etc. across API bases (same order as apiPost). */
export async function apiFetch<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; data: T | null; error?: string; status?: number }> {
  let lastError = "API unavailable";
  let lastStatus: number | undefined;

  for (const base of getApiBases()) {
    const url = buildUrl(base, path);
    try {
      const res = await fetch(url, init);
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        lastError = "API returned HTML (wrong host — not Node server)";
        continue;
      }

      const data = (await res.json()) as T;
      if (res.ok) {
        return { ok: true, data, status: res.status };
      }

      lastStatus = res.status;
      lastError =
        (data as { error?: string })?.error || `HTTP ${res.status}`;
      if (res.status === 401 || res.status === 403) {
        continue;
      }
      return { ok: false, data, error: lastError, status: res.status };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  return { ok: false, data: null, error: lastError, status: lastStatus };
}

/** Binary GET (PDFs, images) across the same API bases as apiFetch. */
export async function apiFetchBlob(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; blob?: Blob; error?: string; status?: number }> {
  let lastError = "API unavailable";
  let lastStatus: number | undefined;

  for (const base of getApiBases()) {
    const url = buildUrl(base, path);
    try {
      const res = await fetch(url, init);
      lastStatus = res.status;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("text/html")) {
        lastError = "API returned HTML (wrong host — not Node server)";
        continue;
      }
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        if (contentType.includes("application/json")) {
          try {
            const data = (await res.json()) as { error?: string };
            lastError = data.error || lastError;
          } catch {
            /* ignore */
          }
        }
        if (res.status === 401 || res.status === 403) continue;
        return { ok: false, error: lastError, status: res.status };
      }
      if (
        !contentType.includes("pdf") &&
        !contentType.includes("octet-stream") &&
        !contentType.includes("image/")
      ) {
        lastError = "Unexpected response type";
        continue;
      }
      const blob = await res.blob();
      if (!blob || blob.size < 8) {
        lastError = "Empty file";
        continue;
      }
      return { ok: true, blob, status: res.status };
    } catch (err) {
      lastError = err instanceof Error ? err.message : String(err);
    }
  }

  return { ok: false, error: lastError, status: lastStatus };
}
