import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const Careers: CollectionConfig = {
  slug: "careers",
  labels: { singular: "شاغر وظيفي", plural: "الشواغر الوظيفية" },
  admin: {
    group: { ar: "التوظيف", en: "Recruitment" },
    useAsTitle: "title",
    defaultColumns: ["title", "department", "city", "open"],
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "department", type: "text", localized: true },
    { name: "city", type: "text", localized: true },
    { name: "descriptionAr", type: "textarea" },
    { name: "descriptionEn", type: "textarea" },
    { name: "open", type: "checkbox", defaultValue: true, admin: { position: "sidebar" } },
  ],
};
