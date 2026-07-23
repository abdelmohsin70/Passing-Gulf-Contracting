import type { CollectionConfig } from "payload";
import { authenticatedOrPublished, isContentEditor, isSuperAdmin, fieldHasRole } from "../access";
import { seoField, verificationField } from "../fields/seo";

export const Projects: CollectionConfig = {
  slug: "projects",
  labels: { singular: { en: "Project / Case Study", ar: "مشروع / دراسة حالة" }, plural: { en: "Projects & Case Studies", ar: "المشاريع ودراسات الحالة" } },
  admin: {
    group: { ar: "المحتوى", en: "Content" },
    useAsTitle: "title",
    defaultColumns: ["title", "verificationStatus", "_status", "updatedAt"],
    description: { en: "No project appears on the public site unless its status is Published and verificationStatus = verified together.", ar: "لا يظهر أي مشروع في الموقع العام إلا إذا كانت حالته Published وverificationStatus = verified معًا." },
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
        { label: { en: "Draft", ar: "مسودة" }, value: "draft" },
        { label: { en: "Under review", ar: "قيد المراجعة" }, value: "review" },
        { label: { en: "Internally approved", ar: "معتمد داخليًا" }, value: "approved" },
        { label: { en: "Published", ar: "منشور" }, value: "published" },
        { label: { en: "Archived", ar: "مؤرشف" }, value: "archived" },
      ],
    },
    {
      name: "confidentialityMode",
      type: "select",
      defaultValue: "named",
      admin: { position: "sidebar" },
      options: [
        { label: { en: "Client name visible", ar: "اسم العميل ظاهر" }, value: "named" },
        { label: { en: "Confidential — only the sector description is shown", ar: "سري — يظهر وصف القطاع فقط" }, value: "confidential" },
      ],
    },
    {
      name: "clientDisplayName",
      type: "text",
      localized: true,
      required: true,
      admin: {
        description: { en: "When \"Confidential\" is selected, write a general description like \"an entity in the healthcare sector\" instead of the actual client name.", ar: "عند اختيار \"سري\" اكتب وصفًا عامًا مثل \"جهة في القطاع الصحي\" بدل اسم العميل الفعلي." },
      },
    },
    { name: "sector", type: "relationship", relationTo: "sectors" },
    { name: "relatedSolutions", type: "relationship", relationTo: "solutions", hasMany: true },
    { name: "city", type: "text", localized: true },
    { name: "contractStartDate", type: "date" },
    { name: "contractEndDate", type: "date" },
    { name: "durationLabel", type: "text", localized: true, admin: { description: { en: "e.g. renewable annual contract.", ar: "مثال: عقد سنوي متجدد." } } },
    { name: "challenge", type: "textarea", localized: true, required: true },
    { name: "scope", type: "textarea", localized: true, required: true },
    { name: "solutionApproach", type: "textarea", localized: true, required: true },
    {
      name: "kpis",
      type: "array",
      labels: { singular: { en: "KPI", ar: "مؤشر" }, plural: { en: "KPIs", ar: "مؤشرات الأداء" } },
      admin: { description: { en: "Do not add a metric here unless it is a figure verified by the client or the operations team.", ar: "لا تُضف مؤشرًا هنا إلا برقم موثّق من العميل أو من فريق التشغيل." } },
      fields: [
        { name: "label", type: "text", localized: true, required: true },
        { name: "beforeValue", type: "text" },
        { name: "afterValue", type: "text" },
        { name: "sourceNote", type: "text", admin: { description: { en: "Source of the figure (internal only, not published).", ar: "مصدر الرقم (داخلي فقط، لا يُنشر)." } } },
      ],
    },
    { name: "gallery", type: "upload", relationTo: "media", hasMany: true },
    {
      name: "testimonial",
      type: "group",
      fields: [
        { name: "quote", type: "textarea", localized: true },
        { name: "attribution", type: "text", localized: true },
        { name: "approved", type: "checkbox", defaultValue: false, label: { en: "Client's consent to publish", ar: "موافقة العميل على النشر" } },
      ],
    },
    {
      name: "approvalEvidence",
      type: "upload",
      relationTo: "media",
      admin: {
        position: "sidebar",
        description: { en: "Proof of client consent (email/letter) — internal only, never shown on the public site.", ar: "إثبات موافقة العميل (بريد/خطاب) — داخلي فقط، لا يظهر على الموقع العام." },
      },
      access: {
        read: fieldHasRole("super-admin", "content-manager"),
      },
    },
    seoField,
  ],
};
