import type { CollectionConfig } from "payload";
import { authenticatedOrPublished, isContentEditor } from "../access";

export const Clients: CollectionConfig = {
  slug: "clients",
  labels: { singular: { en: "Client", ar: "عميل" }, plural: { en: "Client Logos", ar: "شعارات العملاء" } },
  admin: {
    group: { ar: "الثقة والاعتماد", en: "Trust & Proof" },
    useAsTitle: "name",
    description: { en: "No logo appears in \"Our clients\" unless usageApproved is enabled both here and on the image file itself.", ar: "لا يظهر أي شعار في \"عملاؤنا\" إلا إذا كان usageApproved مفعّلًا هنا وعلى ملف الصورة نفسه." },
  },
  access: {
    read: authenticatedOrPublished,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  versions: { drafts: true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "logo", type: "upload", relationTo: "media", required: true },
    { name: "sector", type: "relationship", relationTo: "sectors" },
    { name: "serviceLabel", type: "text", localized: true },
    {
      name: "usageApproved",
      type: "checkbox",
      defaultValue: false,
      label: { en: "Logo usage approval documented", ar: "موافقة استخدام الشعار موثّقة" },
      admin: { position: "sidebar" },
    },
  ],
};
