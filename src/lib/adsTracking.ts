type LeadEvent = {
  formId: string;
  service?: string;
  value?: number;
};

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Fires a Google Ads / GA4 lead event through the existing GTM dataLayer. */
export function trackIntakeLead({ formId, service, value }: LeadEvent): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "generate_lead",
    form_id: formId,
    service: service || "",
    value: typeof value === "number" && Number.isFinite(value) ? value : 0,
    currency: "USD",
  });
}
