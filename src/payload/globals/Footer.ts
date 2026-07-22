import type { GlobalConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "الفوتر",
  access: { read: anyone, update: isContentEditor },
  fields: [
    { name: "descriptionAr", type: "textarea" },
    { name: "descriptionEn", type: "textarea" },
    {
      name: "columns",
      type: "array",
      labels: { singular: "عمود", plural: "أعمدة الفوتر" },
      fields: [
        { name: "titleAr", type: "text", required: true },
        { name: "titleEn", type: "text", required: true },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "labelAr", type: "text", required: true },
            { name: "labelEn", type: "text", required: true },
            { name: "path", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
