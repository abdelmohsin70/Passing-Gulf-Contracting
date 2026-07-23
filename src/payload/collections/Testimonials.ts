import type { CollectionConfig } from "payload";
import { authenticatedOrPublished, isContentEditor } from "../access";
import { verificationField } from "../fields/seo";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: { en: "Testimonial", ar: "شهادة عميل" }, plural: { en: "Testimonials", ar: "شهادات العملاء" } },
  admin: {
    group: { ar: "الثقة والاعتماد", en: "Trust & Proof" },
    useAsTitle: "attribution",
  },
  access: {
    read: authenticatedOrPublished,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  versions: { drafts: true },
  fields: [
    { name: "quote", type: "textarea", localized: true, required: true },
    { name: "attribution", type: "text", localized: true, required: true, admin: { description: { en: "Name/title — or a general description if confidentiality is requested.", ar: "الاسم/المسمى — أو وصف عام إذا طُلبت السرية." } } },
    { name: "organization", type: "text", localized: true },
    { name: "sector", type: "relationship", relationTo: "sectors" },
    { name: "approved", type: "checkbox", defaultValue: false, label: { en: "Client's consent to publish", ar: "موافقة العميل على النشر" }, admin: { position: "sidebar" } },
    verificationField,
  ],
};
