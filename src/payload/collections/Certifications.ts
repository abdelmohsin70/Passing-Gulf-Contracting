import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const Certifications: CollectionConfig = {
  slug: "certifications",
  labels: { singular: { en: "Certification", ar: "شهادة اعتماد" }, plural: { en: "Certifications", ar: "شهادات الاعتماد" } },
  admin: {
    group: { ar: "الثقة والاعتماد", en: "Trust & Proof" },
    useAsTitle: "code",
    defaultColumns: ["code", "issuer", "expiresAt", "publicVisibility"],
    description: { en: "ISO and other certifications. Not shown publicly until a valid copy is uploaded and public visibility is enabled.", ar: "شهادات ISO وغيرها. لا تُعرض للعامة حتى يتم رفع نسخة سارية وتفعيل الظهور العام." },
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: "code", type: "text", required: true, admin: { description: { en: "e.g. ISO 9001:2015", ar: "مثال: ISO 9001:2015" } } },
    { name: "labelAr", type: "text", label: { en: "Description (Arabic)", ar: "الوصف (عربي)" } },
    { name: "labelEn", type: "text", label: "Description (English)" },
    { name: "issuer", type: "text" },
    { name: "certificateNumber", type: "text" },
    { name: "issuedAt", type: "date" },
    { name: "expiresAt", type: "date" },
    { name: "document", type: "upload", relationTo: "media", admin: { description: { en: "The actual certificate file (PDF/image).", ar: "نسخة الشهادة الفعلية (PDF/صورة)." } } },
    {
      name: "publicVisibility",
      type: "checkbox",
      defaultValue: false,
      label: { en: "Show on the Quality & Safety page", ar: "إظهار على صفحة الجودة والسلامة" },
      admin: { position: "sidebar" },
    },
  ],
};
