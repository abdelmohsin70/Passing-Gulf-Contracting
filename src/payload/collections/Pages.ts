import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { authenticatedOrPublished, isContentEditor } from "../access";
import { seoField } from "../fields/seo";

/**
 * Flexible content pages (About, Quality & Safety intro copy, Privacy,
 * Careers intro, etc). Deliberately a simple title+body+SEO shape rather
 * than a full visual block-builder — the marketing pages on this site
 * (home, solutions, sectors) have hand-crafted, highly specific layouts
 * that a generic block system would flatten. Those stay governed by the
 * Solutions/Sectors/Projects collections and the Homepage/SiteSettings
 * globals instead. A block-based builder is a reasonable next step if the
 * team later wants freeform landing pages.
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  labels: { singular: "صفحة", plural: "الصفحات" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "_status", "updatedAt"],
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
      admin: { position: "sidebar", description: "مثال: about، quality-safety، privacy، careers" },
    },
    { name: "subtitle", type: "textarea", localized: true },
    { name: "body", type: "richText", localized: true, editor: lexicalEditor() },
    seoField,
  ],
};
