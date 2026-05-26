import emailjs from "@emailjs/browser";

type IntakePayload = Record<string, unknown>;

function getEnv(name: string): string {
  // Vite exposes only VITE_* vars to the browser.
  return (import.meta.env[name] as string | undefined)?.trim() ?? "";
}

function stringifySafe(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

export function isEmailJsConfigured(): boolean {
  const serviceId = getEnv("VITE_EMAILJS_SERVICE_ID");
  const templateId = getEnv("VITE_EMAILJS_TEMPLATE_ID");
  const publicKey = getEnv("VITE_EMAILJS_PUBLIC_KEY");
  return !!(serviceId && templateId && publicKey);
}

export async function sendIntakeEmailViaEmailJs(payload: IntakePayload): Promise<void> {
  const serviceId = getEnv("VITE_EMAILJS_SERVICE_ID");
  const templateId = getEnv("VITE_EMAILJS_TEMPLATE_ID");
  const publicKey = getEnv("VITE_EMAILJS_PUBLIC_KEY");

  if (!serviceId || !templateId || !publicKey) {
    throw new Error("EmailJS not configured (missing VITE_EMAILJS_* env vars).");
  }

  const adminEmail =
    getEnv("VITE_ADMIN_EMAIL") || "info@cryptorecoveryasset.com";

  const templateParams = {
    to_email: adminEmail,
    // Common fields
    name: stringifySafe(payload.operatorAlias ?? payload.name),
    email: stringifySafe(payload.secureComms ?? payload.email),
    phone: stringifySafe(payload.phone),
    incidentVector: stringifySafe(payload.incidentVector),
    targetNetwork: stringifySafe(payload.targetNetwork),
    transactionHash: stringifySafe(payload.transactionHash),
    estimatedValue: stringifySafe(payload.estimatedValue),
    caseNarrative: stringifySafe(payload.caseNarrative),
    formSource: stringifySafe(payload.formSource),
    timestamp: stringifySafe(payload.timestamp),
    // Full JSON fallback
    raw_json: stringifySafe(payload),
  };

  await emailjs.send(serviceId, templateId, templateParams, { publicKey });
}

