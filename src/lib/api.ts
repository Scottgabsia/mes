const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
  /\/$/,
  ""
) ?? "";

export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

/** True when the server API is reachable (JSON), not static SPA HTML. */
export async function isApiOnline(): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/api/health"), { method: "GET" });
    const type = res.headers.get("content-type") || "";
    return res.ok && type.includes("application/json");
  } catch {
    return false;
  }
}

export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<{ ok: boolean; data: T | null; error?: string }> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("text/html")) {
    return {
      ok: false,
      data: null,
      error:
        "Email API is offline (site is static-only). Use Hostinger Node.js app with npm start, or set VITE_API_BASE_URL to your API server.",
    };
  }

  try {
    const data = (await res.json()) as T;
    return { ok: res.ok, data };
  } catch {
    return { ok: false, data: null, error: "Invalid API response" };
  }
}
