import type { CollectionConfig } from "payload";
import { authenticatedOrPublished, isContentEditor } from "../access";
import { seoField } from "../fields/seo";

export const Solutions: CollectionConfig = {
  slug: "solutions",
  labels: { singular: { en: "Solution", ar: "حل" }, plural: { en: "Solutions", ar: "الحلول" } },
  admin: {
    group: { ar: "المحتوى", en: "Content" },
    useAsTitle: "title",
    defaultColumns: ["title", "featured", "_status", "updatedAt"],
    description: { en: "The families and services of the eight solutions shown on /solutions.", ar: "عائلات وخدمات الحلول الثمانية المعروضة في /solutions." },
  },
  access: {
    read: authenticatedOrPublished,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  versions: { drafts: { autosave: { interval: 1500 } } },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar", description: { en: "Appears in the URL: /solutions/<slug>", ar: "يظهر في الرابط: /solutions/<slug>" } },
    },
    {
      name: "icon",
      type: "select",
      required: true,
      admin: { position: "sidebar" },
      options: [
        "wrench",
        "sparkles",
        "hammer",
        "leaf",
        "plane",
        "bug",
        "concierge",
        "home",
      ].map((v) => ({ label: v, value: v })),
    },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "sortOrder", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
    { name: "summary", type: "textarea", localized: true, required: true },
    { name: "heroOutcome", type: "textarea", localized: true, required: true },
    { name: "problem", type: "textarea", localized: true, required: true },
    {
      name: "scope",
      type: "array",
      minRows: 4,
      labels: { singular: { en: "Item", ar: "بند" }, plural: { en: "Scope of Work", ar: "نطاق الأعمال" } },
      fields: [{ name: "item", type: "text", localized: true, required: true }],
    },
    {
      name: "sectors",
      type: "relationship",
      relationTo: "sectors",
      hasMany: true,
    },
    { name: "methodology", type: "textarea", localized: true, required: true },
    { name: "quality", type: "textarea", localized: true, required: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "faqs",
      type: "array",
      labels: { singular: { en: "Question", ar: "سؤال" }, plural: { en: "FAQs", ar: "الأسئلة الشائعة" } },
      fields: [
        { name: "question", type: "text", localized: true, required: true },
        { name: "answer", type: "textarea", localized: true, required: true },
      ],
    },
    seoField,
  ],
};
