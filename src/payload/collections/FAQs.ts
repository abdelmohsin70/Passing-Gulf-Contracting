import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: { en: "FAQ", ar: "سؤال شائع" }, plural: { en: "FAQs", ar: "الأسئلة الشائعة العامة" } },
  admin: {
    group: { ar: "المحتوى", en: "Content" },
    useAsTitle: "question",
    description: { en: "General questions (not tied to a specific solution) used wherever needed across the site.", ar: "أسئلة عامة (غير مرتبطة بحل معيّن) تُستخدم حيث يلزم عبر الموقع." },
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: "question", type: "text", localized: true, required: true },
    { name: "answer", type: "textarea", localized: true, required: true },
    {
      name: "topic",
      type: "select",
      options: [
        { label: { en: "General", ar: "عام" }, value: "general" },
        { label: { en: "Requests & quotes", ar: "الطلبات والعروض" }, value: "quotes" },
        { label: { en: "Quality & Safety", ar: "الجودة والسلامة" }, value: "quality" },
        { label: { en: "Vacancies", ar: "الوظائف" }, value: "careers" },
      ],
    },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};
