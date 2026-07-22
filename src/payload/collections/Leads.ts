import type { CollectionConfig } from "payload";
import { isSalesTeam, isSuperAdmin } from "../access";

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "site-visit",
  "scheduled",
  "proposal-sent",
  "won",
  "lost",
  "spam",
] as const;

export const Leads: CollectionConfig = {
  slug: "leads",
  labels: { singular: "طلب", plural: "الطلبات" },
  admin: {
    useAsTitle: "referenceNumber",
    defaultColumns: ["referenceNumber", "name", "type", "status", "assignedTo", "createdAt"],
    description: "طلبات المعاينة والعروض والاهتمام الوظيفي الواردة من الموقع.",
    group: { ar: "المبيعات والطلبات", en: "Sales & Leads" },
  },
  access: {
    // Public submissions go through the server action using the Local API
    // with overrideAccess — the REST/admin `create` access below only
    // governs who may add a lead manually from inside the dashboard.
    read: isSalesTeam,
    create: isSalesTeam,
    update: isSalesTeam,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "referenceNumber",
      type: "text",
      required: true,
      unique: true,
      admin: { position: "sidebar" },
    },
    {
      name: "type",
      type: "select",
      required: true,
      defaultValue: "business",
      admin: { position: "sidebar" },
      options: [
        { label: "منشأة / شركة", value: "business" },
        { label: "منزل / فيلا", value: "home" },
        { label: "وظيفة", value: "career" },
        { label: "أخرى", value: "other" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      admin: { position: "sidebar" },
      options: [
        { label: "جديد", value: "new" },
        { label: "تم التواصل", value: "contacted" },
        { label: "مؤهل", value: "qualified" },
        { label: "زيارة مجدولة", value: "site-visit" },
        { label: "موعد محدد", value: "scheduled" },
        { label: "عرض مرسل", value: "proposal-sent" },
        { label: "فاز", value: "won" },
        { label: "خسر", value: "lost" },
        { label: "Spam", value: "spam" },
      ],
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "normal",
      admin: { position: "sidebar" },
      options: [
        { label: "منخفضة", value: "low" },
        { label: "عادية", value: "normal" },
        { label: "عالية", value: "high" },
      ],
    },
    { name: "assignedTo", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "followUpAt", type: "date", admin: { position: "sidebar" } },
    { name: "lossReason", type: "text", admin: { position: "sidebar", condition: (data) => data?.status === "lost" } },

    { name: "name", type: "text", required: true },
    { name: "company", type: "text" },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", required: true },
    {
      name: "preferredContact",
      type: "select",
      defaultValue: "phone",
      options: [
        { label: "هاتف", value: "phone" },
        { label: "واتساب", value: "whatsapp" },
        { label: "بريد إلكتروني", value: "email" },
      ],
    },
    { name: "service", type: "relationship", relationTo: "solutions" },
    { name: "serviceSlug", type: "text", admin: { description: "قيمة الخدمة كما أُرسلت من النموذج (احتياطي إن تعذّر ربطها بسجل حل)." } },
    { name: "sector", type: "relationship", relationTo: "sectors" },
    { name: "sectorSlug", type: "text" },
    { name: "city", type: "text" },
    { name: "message", type: "textarea" },
    { name: "attachments", type: "upload", relationTo: "media", hasMany: true },

    { name: "sourcePage", type: "text" },
    { name: "locale", type: "text" },
    { name: "referrer", type: "text" },
    {
      name: "utm",
      type: "group",
      fields: [
        { name: "source", type: "text" },
        { name: "medium", type: "text" },
        { name: "campaign", type: "text" },
        { name: "term", type: "text" },
        { name: "content", type: "text" },
      ],
    },
    { name: "consentAt", type: "date", admin: { position: "sidebar" } },

    { name: "firstResponseAt", type: "date", admin: { position: "sidebar" } },
    { name: "closedAt", type: "date", admin: { position: "sidebar" } },
  ],
  timestamps: true,
};
