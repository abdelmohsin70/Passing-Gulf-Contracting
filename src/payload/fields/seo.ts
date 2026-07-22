import type { Field } from "payload";

export const seoField: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: { description: "عنوان ووصف الصفحة في نتائج البحث ومشاركات التواصل." },
  fields: [
    {
      name: "metaTitle",
      type: "text",
      localized: true,
      admin: { description: "60 حرفًا تقريبًا. اتركه فارغًا لاستخدام العنوان الافتراضي." },
    },
    {
      name: "metaDescription",
      type: "textarea",
      localized: true,
      admin: { description: "155 حرفًا تقريبًا." },
    },
    {
      name: "ogImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "noIndex",
      type: "checkbox",
      defaultValue: false,
      label: "منع الفهرسة (noindex)",
    },
  ],
};

export const verificationField: Field = {
  name: "verificationStatus",
  type: "select",
  defaultValue: "unverified",
  required: true,
  options: [
    { label: "غير موثّق", value: "unverified" },
    { label: "قيد التوثيق", value: "pending" },
    { label: "موثّق ومعتمد", value: "verified" },
    { label: "مرفوض", value: "rejected" },
  ],
  admin: {
    position: "sidebar",
    description: "لا يظهر أي عنصر بحالة غير \"موثّق ومعتمد\" في الموقع العام.",
  },
};
