import type { GlobalConfig } from "payload";
import { anyone, isContentEditor } from "../access";
import { seoField } from "../fields/seo";

export const Homepage: GlobalConfig = {
  slug: "homepage",
  admin: {
    group: { ar: "صفحات الموقع", en: "Site Pages" },
  },
  label: { en: "Homepage", ar: "الصفحة الرئيسية" },
  // Globals have no draft/publish state unless versions.drafts is enabled
  // (it isn't here) — authenticatedOrPublished's `{_status: ...}` filter
  // would 500 on every anonymous read since the field doesn't exist. This
  // was a latent bug (never triggered because the frontend never actually
  // queried this global) until the AboutPage/QualitySafetyPage globals hit
  // the identical issue and revealed the root cause.
  access: { read: anyone, update: isContentEditor },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        { name: "subtitle", type: "textarea", localized: true, required: true },
        { name: "ctaPrimaryLabel", type: "text", localized: true, required: true },
        { name: "ctaSecondaryLabel", type: "text", localized: true, required: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "partnerSection",
      type: "group",
      label: "شريك واحد، منظومة متكاملة",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "textarea", localized: true },
      ],
    },
    {
      name: "outcomesSection",
      type: "group",
      label: "لماذا تختار اجتياز الخليج",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "textarea", localized: true },
      ],
    },
    {
      name: "featuredCaseStudy",
      type: "relationship",
      relationTo: "projects",
      admin: {
        description: "لا يظهر في الرئيسية إلا إذا كان هذا المشروع منشورًا وverificationStatus = verified.",
      },
    },
    {
      name: "showClientsSection",
      type: "checkbox",
      defaultValue: false,
      label: "إظهار قسم \"عملاؤنا\"",
      admin: { description: "فعّله فقط بعد إضافة شعارات عملاء معتمدة usageApproved في مجموعة Clients." },
    },
    {
      name: "homeCareBanner",
      type: "group",
      label: "بانر العناية المنزلية",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "textarea", localized: true },
        { name: "ctaLabel", type: "text", localized: true },
      ],
    },
    {
      name: "finalCta",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "textarea", localized: true },
        { name: "buttonLabel", type: "text", localized: true },
      ],
    },
    seoField,
  ],
};
