import type { Field } from "payload";

export const seoField: Field = {
  name: "seo",
  type: "group",
  label: "SEO",
  admin: { description: { en: "Page title and description shown in search results and social shares.", ar: "عنوان ووصف الصفحة في نتائج البحث ومشاركات التواصل." } },
  fields: [
    {
      name: "metaTitle",
      type: "text",
      localized: true,
      admin: { description: { en: "About 60 characters. Leave blank to use the default title.", ar: "60 حرفًا تقريبًا. اتركه فارغًا لاستخدام العنوان الافتراضي." } },
    },
    {
      name: "metaDescription",
      type: "textarea",
      localized: true,
      admin: { description: { en: "About 155 characters.", ar: "155 حرفًا تقريبًا." } },
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
      label: { en: "Prevent indexing (noindex)", ar: "منع الفهرسة (noindex)" },
    },
  ],
};

export const verificationField: Field = {
  name: "verificationStatus",
  type: "select",
  defaultValue: "unverified",
  required: true,
  options: [
    { label: { en: "Unverified", ar: "غير موثّق" }, value: "unverified" },
    { label: { en: "Pending verification", ar: "قيد التوثيق" }, value: "pending" },
    { label: { en: "Verified & approved", ar: "موثّق ومعتمد" }, value: "verified" },
    { label: { en: "Rejected", ar: "مرفوض" }, value: "rejected" },
  ],
  admin: {
    position: "sidebar",
    description: { en: "Nothing appears on the public site unless its status is \"Verified & approved\".", ar: "لا يظهر أي عنصر بحالة غير \"موثّق ومعتمد\" في الموقع العام." },
  },
};
