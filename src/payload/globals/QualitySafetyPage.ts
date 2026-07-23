import type { GlobalConfig } from "payload";
import { anyone, isContentEditor } from "../access";
import { seoField } from "../fields/seo";

export const QualitySafetyPage: GlobalConfig = {
  slug: "quality-safety-page",
  admin: {
    group: { ar: "صفحات الموقع", en: "Site Pages" },
  },
  label: { en: "Quality & Safety Page", ar: "صفحة الجودة والسلامة" },
  // Globals have no draft/publish state unless versions.drafts is enabled
  // (it isn't here) — authenticatedOrPublished's `{_status: ...}` filter
  // would 500 on every anonymous read since the field doesn't exist.
  access: { read: anyone, update: isContentEditor },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "subtitle", type: "textarea", localized: true, required: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
    {
      name: "commitments",
      type: "array",
      label: "التزاماتنا",
      labels: { singular: "التزام", plural: "الالتزامات" },
      minRows: 1,
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        { name: "body", type: "textarea", localized: true, required: true },
      ],
    },
    {
      name: "certificationsSection",
      type: "group",
      label: "قسم الشهادات",
      fields: [
        { name: "title", type: "text", localized: true, required: true },
        {
          name: "note",
          type: "textarea",
          localized: true,
          admin: { description: "نص توضيحي يظهر أسفل الشهادات — مثال: حالة التحقق من الشهادات." },
        },
      ],
    },
    seoField,
  ],
};
