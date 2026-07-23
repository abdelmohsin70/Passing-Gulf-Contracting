import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const Redirects: CollectionConfig = {
  slug: "redirects",
  labels: { singular: { en: "Redirect", ar: "إعادة توجيه" }, plural: { en: "Redirects", ar: "إعادة التوجيهات" } },
  admin: {
    group: { ar: "النظام والمستخدمون", en: "System & Users" },
    useAsTitle: "from",
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: "from", type: "text", required: true, unique: true, admin: { description: { en: "The old path, e.g. /ar/old-page", ar: "المسار القديم، مثال: /ar/old-page" } } },
    { name: "to", type: "text", required: true, admin: { description: { en: "The new path or a full URL.", ar: "المسار الجديد أو رابط كامل." } } },
    {
      name: "type",
      type: "select",
      defaultValue: "301",
      options: [
        { label: { en: "301 — Permanent", ar: "301 — دائم" }, value: "301" },
        { label: { en: "302 — Temporary", ar: "302 — مؤقت" }, value: "302" },
      ],
    },
  ],
};
