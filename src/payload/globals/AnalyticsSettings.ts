import type { GlobalConfig } from "payload";
import { isAnalyst, isSuperAdmin } from "../access";

export const AnalyticsSettings: GlobalConfig = {
  slug: "analytics-settings",
  label: "إعدادات التحليلات",
  access: { read: isAnalyst, update: isSuperAdmin },
  fields: [
    {
      name: "provider",
      type: "select",
      defaultValue: "none",
      options: [
        { label: "غير مربوط", value: "none" },
        { label: "Google Analytics 4", value: "ga4" },
        { label: "PostHog", value: "posthog" },
      ],
    },
    { name: "ga4MeasurementId", type: "text", admin: { condition: (data) => data?.provider === "ga4" } },
    { name: "ga4PropertyId", type: "text", admin: { description: "لسحب تقارير GA4 Data API لعرضها في اللوحة.", condition: (data) => data?.provider === "ga4" } },
    { name: "posthogProjectApiKey", type: "text", admin: { condition: (data) => data?.provider === "posthog" } },
    { name: "posthogHost", type: "text", admin: { condition: (data) => data?.provider === "posthog" } },
    { name: "cookieConsentRequired", type: "checkbox", defaultValue: false },
  ],
};
