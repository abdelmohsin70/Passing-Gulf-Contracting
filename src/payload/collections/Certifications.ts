import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const Certifications: CollectionConfig = {
  slug: "certifications",
  labels: { singular: "شهادة اعتماد", plural: "شهادات الاعتماد" },
  admin: {
    group: { ar: "الثقة والاعتماد", en: "Trust & Proof" },
    useAsTitle: "code",
    defaultColumns: ["code", "issuer", "expiresAt", "publicVisibility"],
    description: "شهادات ISO وغيرها. لا تُعرض للعامة حتى يتم رفع نسخة سارية وتفعيل الظهور العام.",
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: "code", type: "text", required: true, admin: { description: "مثال: ISO 9001:2015" } },
    { name: "labelAr", type: "text", label: "الوصف (عربي)" },
    { name: "labelEn", type: "text", label: "Description (English)" },
    { name: "issuer", type: "text" },
    { name: "certificateNumber", type: "text" },
    { name: "issuedAt", type: "date" },
    { name: "expiresAt", type: "date" },
    { name: "document", type: "upload", relationTo: "media", admin: { description: "نسخة الشهادة الفعلية (PDF/صورة)." } },
    {
      name: "publicVisibility",
      type: "checkbox",
      defaultValue: false,
      label: "إظهار على صفحة الجودة والسلامة",
      admin: { position: "sidebar" },
    },
  ],
};
