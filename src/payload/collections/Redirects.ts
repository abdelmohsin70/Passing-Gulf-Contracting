import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const Redirects: CollectionConfig = {
  slug: "redirects",
  labels: { singular: "إعادة توجيه", plural: "إعادة التوجيهات" },
  admin: { useAsTitle: "from" },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: "from", type: "text", required: true, unique: true, admin: { description: "المسار القديم، مثال: /ar/old-page" } },
    { name: "to", type: "text", required: true, admin: { description: "المسار الجديد أو رابط كامل." } },
    {
      name: "type",
      type: "select",
      defaultValue: "301",
      options: [
        { label: "301 — دائم", value: "301" },
        { label: "302 — مؤقت", value: "302" },
      ],
    },
  ],
};
