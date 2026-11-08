type LeadEvent = {
  formId?: string;
  service?: string;
  value?: number;
  caseId?: string;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Google Ads conversion already created in GTM for the thank-you URL. */
const ADS_LEAD_SEND_TO = "AW-18143321084/LtDiCJ2IlqEdEPy3tMtD";
const COUNTED_KEY = "ads_lead_conversion";

function sendGtagConversion(value: number): boolean {
  if (typeof window.gtag !== "function") return false;
  window.gtag("event", "conversion", {
    send_to: ADS_LEAD_SEND_TO,
    value,
    currency: "USD",
  });
  return true;
}

/**
 * Count a Google Ads lead when the success page (/intake-received) is shown.
 * SPA navigation does not reload the page, so this calls gtag directly.
 */
export function trackIntakeLeadConversion({
  formId = "intake-received",
  service,
  value,
  caseId,
}: LeadEvent = {}): void {
  if (typeof window === "undefined") return;

  const countedKey = `${COUNTED_KEY}:${caseId || "session"}`;
  try {
    if (sessionStorage.getItem(countedKey) === "1") return;
    sessionStorage.setItem(countedKey, "1");
  } catch {
    /* private mode */
  }

  const amount = typeof value === "number" && Number.isFinite(value) ? value : 0;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "generate_lead",
    form_id: formId,
    service: service || "",
    value: amount,
    currency: "USD",
    case_id: caseId || "",
  });

  if (sendGtagConversion(amount)) return;

  const started = Date.now();
  const timer = window.setInterval(() => {
    if (sendGtagConversion(amount) || Date.now() - started > 8000) {
      window.clearInterval(timer);
    }
  }, 300);
}
