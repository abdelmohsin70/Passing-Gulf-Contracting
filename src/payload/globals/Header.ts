import type { GlobalConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const Header: GlobalConfig = {
  slug: "header",
  admin: {
    group: { ar: "صفحات الموقع", en: "Site Pages" },
  },
  label: { en: "Header & Menu", ar: "الهيدر والقائمة" },
  access: { read: anyone, update: isContentEditor },
  fields: [
    {
      name: "topBar",
      type: "group",
      fields: [
        { name: "locationAr", type: "text", defaultValue: "الرياض، المملكة العربية السعودية" },
        { name: "locationEn", type: "text", defaultValue: "Riyadh, Saudi Arabia" },
        { name: "availabilityAr", type: "text", defaultValue: "خدمة الطوارئ الفنية 24/7" },
        { name: "availabilityEn", type: "text", defaultValue: "24/7 Technical Emergency Response" },
      ],
    },
    {
      name: "navItems",
      type: "array",
      labels: { singular: "رابط", plural: "روابط القائمة" },
      fields: [
        { name: "labelAr", type: "text", required: true },
        { name: "labelEn", type: "text", required: true },
        { name: "path", type: "text", required: true, admin: { description: { en: "A relative path without locale, e.g. /solutions", ar: "مسار نسبي بدون locale، مثال: /solutions" } } },
      ],
    },
    { name: "ctaLabelAr", type: "text", defaultValue: "اطلب معاينة وعرضًا" },
    { name: "ctaLabelEn", type: "text", defaultValue: "Request a Visit & Quote" },
  ],
};
