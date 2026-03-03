/**
 * Analytics: send events to PostHog, GA4, or console.
 * Set NEXT_PUBLIC_POSTHOG_KEY for PostHog; gtag is used if window.gtag exists.
 */

export type AnalyticsEvent =
  | "landing_view"
  | "upload_started"
  | "job_created"
  | "job_succeeded"
  | "job_failed"
  | "bulk_process_all_clicked"
  | "copy_link_clicked"
  | "pricing_viewed"
  | "checkout_started"
  | "purchase_completed";

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: { capture: (event: string, props?: Record<string, unknown>) => void };
  }
}

export function track(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  const payload = { event, ...props };
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", payload);
  }
  try {
    if (window.posthog) {
      window.posthog.capture(event, payload as Record<string, unknown>);
    }
    if (window.gtag) {
      window.gtag("event", event, payload);
    }
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("Analytics error:", e);
    }
  }
}
