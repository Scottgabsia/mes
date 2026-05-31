import fs from "fs";
import path from "path";
import type { Request, Response, NextFunction } from "express";

/** Escape user content before embedding in HTML email templates. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Strip tags and common injection payloads from plain-text fields. */
export function sanitizePlainText(value: unknown, maxLen = 10_000): string {
  if (typeof value !== "string") return "";
  let s = value.replace(/\0/g, "").trim();
  s = s.replace(/<[^>]*>/g, "");
  s = s.replace(/javascript:/gi, "");
  s = s.replace(/vbscript:/gi, "");
  s = s.replace(/data:text\/html/gi, "");
  s = s.replace(/on\w+\s*=/gi, "");
  return s.slice(0, maxLen);
}

const MALICIOUS_PATTERNS: RegExp[] = [
  /<\?php/i,
  /<\?=/i,
  /<\?/,
  /<script[\s>]/i,
  /<\/script>/i,
  /eval\s*\(/i,
  /base64_decode\s*\(/i,
  /shell_exec\s*\(/i,
  /passthru\s*\(/i,
  /system\s*\(/i,
  /exec\s*\(/i,
  /document\.write/i,
  /(\bunion\b[\s\S]{0,40}\bselect\b)/i,
  /(\bdrop\b[\s\S]{0,20}\btable\b)/i,
  /(\binsert\b[\s\S]{0,30}\binto\b)/i,
  /\/etc\/passwd/i,
  /cmd\.exe/i,
  /powershell/i,
];

/** Japanese / Chinese / Korean SEO spam and casino-style injection strings. */
const SEO_SPAM_PATTERNS: RegExp[] = [
  /賭博/,
  /博彩/,
  /老虎机/,
  /娱乐城/,
  /线上娱乐/,
  /棋牌/,
  /カジノ/,
  /オンラインカジノ/,
  /スロット/,
  /遊技場/,
  /パチンコ/,
  /바카라/,
  /카지노/,
  /casino/i,
  /viagra/i,
  /cialis/i,
  /payday loan/i,
];

export function containsMaliciousPayload(text: string): boolean {
  if (!text) return false;
  return MALICIOUS_PATTERNS.some((pattern) => pattern.test(text));
}

export function containsSeoSpam(text: string): boolean {
  if (!text || text.length < 8) return false;

  if (SEO_SPAM_PATTERNS.some((pattern) => pattern.test(text))) {
    return true;
  }

  const cjkChars = (
    text.match(/[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uac00-\ud7af]/g) ||
    []
  ).length;
  if (cjkChars / text.length > 0.25 && text.length > 20) {
    return true;
  }

  const urlHits = (text.match(/https?:\/\/|www\./gi) || []).length;
  if (urlHits >= 3) return true;

  return false;
}

export function rejectIfUnsafeText(
  text: string,
  label: string
): string | null {
  if (containsMaliciousPayload(text) || containsSeoSpam(text)) {
    console.warn(`[Security] Blocked ${label}: suspicious content`);
    return `Submission blocked: suspicious content in ${label}.`;
  }
  return null;
}

const RECOVERY_TEXT_FIELDS: Record<string, number> = {
  operatorAlias: 200,
  name: 200,
  caseNarrative: 15_000,
  transactionHash: 256,
  incidentVector: 200,
  targetNetwork: 200,
  phone: 64,
  secureComms: 320,
  email: 320,
  formSource: 120,
  estimatedValue: 64,
  status: 64,
};

export function sanitizeRecoveryPayload(
  body: Record<string, unknown>
): { ok: true; data: Record<string, unknown> } | { ok: false; error: string } {
  const serialized = JSON.stringify(body);
  const globalError = rejectIfUnsafeText(serialized, "payload");
  if (globalError) return { ok: false, error: globalError };

  const sanitized: Record<string, unknown> = { ...body };

  for (const [key, maxLen] of Object.entries(RECOVERY_TEXT_FIELDS)) {
    if (!(key in sanitized)) continue;
    const raw = String(sanitized[key] ?? "");
    const fieldError = rejectIfUnsafeText(raw, key);
    if (fieldError) return { ok: false, error: fieldError };
    sanitized[key] = sanitizePlainText(raw, maxLen);
  }

  return { ok: true, data: sanitized };
}

export function sanitizeMessageText(text: string): string {
  const trimmed = sanitizePlainText(text, 4000);
  const err = rejectIfUnsafeText(trimmed, "message");
  if (err) throw new Error(err);
  return trimmed;
}

export function blockProbePaths(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const p = req.path.toLowerCase();
  const blocked = [
    /\.php\d?$/i,
    /\.phtml$/i,
    /\.phar$/i,
    /^\/wp-/i,
    /\/wp-admin/i,
    /\/wp-login/i,
    /\/wp-content/i,
    /\/wp-includes/i,
    /\/xmlrpc\.php/i,
    /\/\.env/i,
    /\/\.git/i,
    /\/shell/i,
    /\/c99/i,
    /\/r57/i,
    /\/admin\.php/i,
    /\/config\.php/i,
    /\/upload\.php/i,
    /\/index\.php/i,
    /\/alfa/i,
    /\/wso/i,
  ];

  if (blocked.some((pattern) => pattern.test(p))) {
    console.warn(
      `[Security] Blocked probe ${req.method} ${req.path} from ${req.ip}`
    );
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  next();
}

type RateBucket = { count: number; resetAt: number };

export function createRateLimiter(options: {
  windowMs: number;
  max: number;
  keyPrefix?: string;
}) {
  const hits = new Map<string, RateBucket>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const key = `${options.keyPrefix || "rl"}:${ip}`;
    const now = Date.now();

    let entry = hits.get(key);
    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + options.windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;
    if (entry.count > options.max) {
      console.warn(
        `[Security] Rate limit ${key} (${entry.count}/${options.max})`
      );
      res.status(429).json({
        success: false,
        error: "Too many requests. Try again later.",
      });
      return;
    }
    next();
  };
}

export function applySecurityHeaders(isProduction: boolean) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=()"
    );
    if (isProduction) {
      res.setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      );
    }
    next();
  };
}

const DANGEROUS_UPLOAD_EXTENSIONS = [
  ".php",
  ".phtml",
  ".php5",
  ".phar",
  ".htaccess",
  ".cgi",
  ".pl",
  ".asp",
  ".aspx",
  ".jsp",
  ".exe",
  ".sh",
  ".bat",
  ".cmd",
  ".js",
  ".html",
  ".htm",
  ".svg",
];

export function isDangerousUploadFilename(filename: string): boolean {
  const lower = filename.toLowerCase();
  return DANGEROUS_UPLOAD_EXTENSIONS.some(
    (ext) => lower.endsWith(ext) || lower.includes(`${ext}?`)
  );
}

export function assertDistHasNoPhpArtifacts(distPath: string): void {
  if (!distPath || !fs.existsSync(distPath)) return;

  const suspicious = [".php", ".phtml", ".phar"];

  function walk(dir: string): void {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
        continue;
      }
      if (suspicious.some((ext) => name.toLowerCase().endsWith(ext))) {
        throw new Error(
          `[Security] Malicious artifact detected in build output: ${full}`
        );
      }
    }
  }

  walk(distPath);
}
