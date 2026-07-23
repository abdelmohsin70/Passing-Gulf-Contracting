import type { CollectionConfig } from "payload";
import { isAnalyst, systemWriteOnly } from "../access";

/**
 * Aggregated, privacy-safe daily rollups for the dashboard's traffic
 * widgets. Populated by a sync job pulling from GA4/PostHog once real
 * credentials are configured (see src/payload/lib/analytics-sync.ts) —
 * never raw events, never PII. Until that sync runs, the dashboard shows
 * an explicit "not connected" state instead of fabricated numbers.
 */
export const AnalyticsDaily: CollectionConfig = {
  slug: "analytics-daily",
  labels: { singular: { en: "Daily Analytics", ar: "إحصائية يومية" }, plural: { en: "Daily Analytics", ar: "الإحصائيات اليومية" } },
  admin: {
    group: { ar: "النظام والمستخدمون", en: "System & Users" },
    useAsTitle: "date",
    defaultColumns: ["date", "pageViews", "visitors", "quoteSubmits"],
    description: "بيانات مجمّعة يوميًا من مزود التحليلات المربوط — للقراءة فقط.",
  },
  access: {
    read: isAnalyst,
    create: systemWriteOnly,
    update: systemWriteOnly,
    delete: systemWriteOnly,
  },
  fields: [
    { name: "date", type: "date", required: true, unique: true },
    { name: "pageViews", type: "number", defaultValue: 0 },
    { name: "visitors", type: "number", defaultValue: 0 },
    { name: "sessions", type: "number", defaultValue: 0 },
    { name: "quoteStarts", type: "number", defaultValue: 0 },
    { name: "quoteSubmits", type: "number", defaultValue: 0 },
    { name: "phoneClicks", type: "number", defaultValue: 0 },
    { name: "whatsappClicks", type: "number", defaultValue: 0 },
    {
      name: "topPages",
      type: "array",
      fields: [
        { name: "path", type: "text" },
        { name: "views", type: "number" },
      ],
    },
    {
      name: "deviceBreakdown",
      type: "group",
      fields: [
        { name: "desktop", type: "number", defaultValue: 0 },
        { name: "mobile", type: "number", defaultValue: 0 },
        { name: "tablet", type: "number", defaultValue: 0 },
      ],
    },
    { name: "source", type: "select", options: [{ label: "GA4", value: "ga4" }, { label: "PostHog", value: "posthog" }] },
  ],
  timestamps: true,
};
