import type { CollectionConfig } from "payload";
import { authenticatedOrPublished, isContentEditor, isSuperAdmin, fieldHasRole } from "../access";
import { seoField, verificationField } from "../fields/seo";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: "مشروع / دراسة حالة", plural: "المشاريع ودراسات الحالة" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "verificationStatus", "_status", "updatedAt"],
    description:
      "لا يظهر أي مشروع في الموقع العام إلا إذا كانت حالته Published وverificationStatus = verified معًا.",
  },
  access: {
    // Public visitors only ever see published + verified case studies —
    // enforced in the frontend query (see src/payload/queries) in addition
    // to the draft/published split already handled here.
    read: authenticatedOrPublished,
    create: isContentEditor,
    update: isContentEditor,
    delete: isSuperAdmin,
  },
  versions: { drafts: { autosave: { interval: 1500 } } },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text", required: true, unique: true, admin: { position: "sidebar" } },
    verificationField,
    {
      name: "workflowStatus",
      type: "select",
      defaultValue: "draft",
      admin: { position: "sidebar" },
      options: [
        { label: "مسودة", value: "draft" },
        { label: "قيد المراجعة", value: "review" },
        { label: "معتمد داخليًا", value: "approved" },
        { label: "منشور", value: "published" },
        { label: "مؤرشف", value: "archived" },
      ],
    },
    {
      name: "confidentialityMode",
      type: "select",
      defaultValue: "named",
      admin: { position: "sidebar" },
      options: [
        { label: "اسم العميل ظاهر", value: "named" },
        { label: "سري — يظهر وصف القطاع فقط", value: "confidential" },
      ],
    },
    {
      name: "clientDisplayName",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description:
          "عند اختيار \"سري\" اكتب وصفًا عامًا مثل \"جهة في القطاع الصحي\" بدل اسم العميل الفعلي.",
      },
    },
    { name: "sector", type: "relationship", relationTo: "sectors" },
    { name: "relatedSolutions", type: "relationship", relationTo: "solutions", hasMany: true },
    { name: "city", type: "text", localized: true },
    { name: "contractStartDate", type: "date" },
    { name: "contractEndDate", type: "date" },
    { name: "durationLabel", type: "text", localized: true, admin: { description: "مثال: عقد سنوي متجدد." } },
    { name: "challenge", type: "textarea", localized: true, required: true },
    { name: "scope", type: "textarea", localized: true, required: true },
    { name: "solutionApproach", type: "textarea", localized: true, required: true },
    {
      name: "kpis",
      type: "array",
      labels: { singular: "مؤشر", plural: "مؤشرات الأداء" },
      admin: { description: "لا تُضف مؤشرًا هنا إلا برقم موثّق من العميل أو من فريق التشغيل." },
      fields: [
        { name: "label", type: "text", localized: true, required: true },
        { name: "beforeValue", type: "text" },
        { name: "afterValue", type: "text" },
        { name: "sourceNote", type: "text", admin: { description: "مصدر الرقم (داخلي فقط، لا يُنشر)." } },
      ],
    },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "testimonial",
      type: "group",
      fields: [
        { name: "quote", type: "textarea", localized: true },
        { name: "attribution", type: "text", localized: true },
        { name: "approved", type: "checkbox", defaultValue: false, label: "موافقة العميل على النشر" },
      ],
    },
    {
      name: "approvalEvidence",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: "إثبات موافقة العميل (بريد/خطاب) — داخلي فقط، لا يظهر على الموقع العام.",
      },
      access: {
        read: fieldHasRole("super-admin", "content-manager"),
      },
    },
    seoField,
  ],
};
