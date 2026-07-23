import type { CollectionConfig } from "payload";
import { authenticatedOrPublished, isContentEditor } from "../access";
import { seoField } from "../fields/seo";

export const Sectors: CollectionConfig = {
  slug: "sectors",
  labels: { singular: { en: "Sector", ar: "قطاع" }, plural: { en: "Sectors", ar: "القطاعات" } },
  admin: {
    group: { ar: "المحتوى", en: "Content" },
    useAsTitle: "title",
    defaultColumns: ["title", "_status", "updatedAt"],
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
      admin: { position: "sidebar" },
    },
    {
      name: "icon",
      type: "select",
      required: true,
      admin: { position: "sidebar" },
      options: ["office", "health", "residential", "industrial", "education", "airport", "government"].map(
        (v) => ({ label: v, value: v })
      ),
    },
    { name: "sortOrder", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
    { name: "summary", type: "textarea", localized: true, required: true },
    {
      name: "challenges",
      type: "array",
      labels: { singular: { en: "Challenge", ar: "تحدٍ" }, plural: { en: "Sector Challenges", ar: "تحديات القطاع" } },
      fields: [{ name: "item", type: "text", localized: true, required: true }],
    },
    {
      name: "relevantSolutions",
      type: "relationship",
      relationTo: "solutions",
      hasMany: true,
    },
    {
      name: "operatingModel",
      type: "textarea",
      localized: true,
      admin: { description: { en: "How the operating model fits this sector.", ar: "كيف نموذج التشغيل المناسب لهذا القطاع." } },
    },
    { name: "media", type: "upload", relationTo: "media" },
    {
      name: "faqs",
      type: "array",
      fields: [
        { name: "question", type: "text", localized: true, required: true },
        { name: "answer", type: "textarea", localized: true, required: true },
      ],
    },
    seoField,
  ],
};
