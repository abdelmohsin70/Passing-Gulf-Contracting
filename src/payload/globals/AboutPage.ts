import type { GlobalConfig } from "payload";
import { anyone, isContentEditor } from "../access";
import { seoField } from "../fields/seo";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  admin: {
    group: { ar: "صفحات الموقع", en: "Site Pages" },
  },
  label: { en: "About Page", ar: "صفحة من نحن" },
  // Globals have no draft/publish state unless versions.drafts is enabled
  // (it isn't here) — authenticatedOrPublished's `{_status: ...}` filter
  // would 500 on every anonymous read since the field doesn't exist.
  access: { read: anyone, update: isContentEditor },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "subtitle", type: "textarea", localized: true, required: true },
    {
      name: "story",
      type: "group",
      label: { en: "Our story", ar: "قصتنا" },
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        { name: "body", type: "textarea", localized: true, required: true },
        { name: "image", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "missionSection",
      type: "group",
      label: { en: "Vision & mission", ar: "الرؤية والرسالة" },
      fields: [
        { name: "sectionTitle", type: "text", localized: true, required: true },
        { name: "visionLabel", type: "text", localized: true, required: true },
        { name: "visionBody", type: "textarea", localized: true, required: true },
        { name: "missionLabel", type: "text", localized: true, required: true },
        { name: "missionBody", type: "textarea", localized: true, required: true },
      ],
    },
    {
      name: "values",
      type: "array",
      label: { en: "Values", ar: "القيم" },
      labels: { singular: "قيمة", plural: "القيم" },
      minRows: 1,
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        { name: "body", type: "textarea", localized: true, required: true },
      ],
    },
    {
      name: "valuesLabel",
      type: "text",
      localized: true,
      admin: { description: { en: "The values section heading, e.g. Our values.", ar: "عنوان قسم القيم، مثال: قيمنا." } },
    },
    {
      name: "sideImage",
      type: "upload",
      relationTo: "media",
      admin: { description: { en: "The side image next to the \"Why Ijtiyaz Al Khaleej\" box.", ar: "الصورة الجانبية بجوار مربّع \"لماذا اجتياز الخليج\"." } },
    },
    { name: "whyTitle", type: "text", localized: true, required: true, label: { en: "The \"Why Ijtiyaz Al Khaleej\" heading", ar: "عنوان \"لماذا اجتياز الخليج\"" } },
    {
      name: "why",
      type: "array",
      label: { en: "Reasons to choose Ijtiyaz Al Khaleej", ar: "أسباب اختيار اجتياز الخليج" },
      labels: { singular: "سبب", plural: "الأسباب" },
      minRows: 1,
      fields: [{ name: "item", type: "text", localized: true, required: true }],
    },
    seoField,
  ],
};
