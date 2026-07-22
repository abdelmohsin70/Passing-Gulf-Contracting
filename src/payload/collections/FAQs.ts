import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const FAQs: CollectionConfig = {
  slug: "faqs",
  labels: { singular: "سؤال شائع", plural: "الأسئلة الشائعة العامة" },
  admin: {
    group: { ar: "المحتوى", en: "Content" },
    useAsTitle: "question",
    description: "أسئلة عامة (غير مرتبطة بحل معيّن) تُستخدم حيث يلزم عبر الموقع.",
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
        { label: "عام", value: "general" },
        { label: "الطلبات والعروض", value: "quotes" },
        { label: "الجودة والسلامة", value: "quality" },
        { label: "الوظائف", value: "careers" },
      ],
    },
    { name: "sortOrder", type: "number", defaultValue: 0 },
  ],
};
