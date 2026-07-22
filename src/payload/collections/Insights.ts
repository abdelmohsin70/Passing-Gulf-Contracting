import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { authenticatedOrPublished, isContentEditor } from "../access";
import { seoField } from "../fields/seo";

export const Insights: CollectionConfig = {
  slug: "insights",
  labels: { singular: "مقالة", plural: "مركز المعرفة" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "_status", "publishedAt"],
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
    { name: "slug", type: "text", required: true, unique: true, admin: { position: "sidebar" } },
    { name: "excerpt", type: "textarea", localized: true, required: true },
    { name: "body", type: "richText", localized: true, editor: lexicalEditor(), required: true },
    { name: "cover", type: "upload", relationTo: "media" },
    {
      name: "category",
      type: "select",
      options: [
        { label: "صيانة وتشغيل", value: "maintenance" },
        { label: "إدارة مرافق", value: "facility-management" },
        { label: "الجودة والسلامة", value: "quality-safety" },
        { label: "دليل الشراء", value: "buyers-guide" },
      ],
    },
    { name: "tags", type: "text", hasMany: true },
    { name: "author", type: "relationship", relationTo: "users" },
    { name: "readingTimeMinutes", type: "number" },
    { name: "publishedAt", type: "date", admin: { position: "sidebar" } },
    seoField,
  ],
};
