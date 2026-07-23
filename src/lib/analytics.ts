/**
 * Thin analytics adapter. No tracking script is ever injected unless
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see AnalyticsScript), so calling
 * trackEvent is always safe — it silently no-ops when analytics isn't
 * configured or consent hasn't been granted.
 */

export type AnalyticsEvent =
  | "quote_start"
  | "quote_submit"
  | "whatsapp_click"
  | "phone_click"
  | "service_view"
  | "sector_view"
  | "insight_view"
  | "case_study_view";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}
