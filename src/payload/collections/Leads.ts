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
  labels: { singular: { en: "Lead", ar: "طلب" }, plural: { en: "Leads", ar: "الطلبات" } },
  admin: {
    useAsTitle: "referenceNumber",
    defaultColumns: ["referenceNumber", "name", "type", "status", "assignedTo", "createdAt"],
    description: { en: "Site-visit, quote, and career-interest requests submitted through the website.", ar: "طلبات المعاينة والعروض والاهتمام الوظيفي الواردة من الموقع." },
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
        { label: { en: "Facility / Company", ar: "منشأة / شركة" }, value: "business" },
        { label: { en: "Home / Villa", ar: "منزل / فيلا" }, value: "home" },
        { label: { en: "Career", ar: "وظيفة" }, value: "career" },
        { label: { en: "Other", ar: "أخرى" }, value: "other" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      admin: { position: "sidebar" },
      options: [
        { label: { en: "New", ar: "جديد" }, value: "new" },
        { label: { en: "Contacted", ar: "تم التواصل" }, value: "contacted" },
        { label: { en: "Qualified", ar: "مؤهل" }, value: "qualified" },
        { label: { en: "Site visit", ar: "زيارة مجدولة" }, value: "site-visit" },
        { label: { en: "Scheduled", ar: "موعد محدد" }, value: "scheduled" },
        { label: { en: "Proposal sent", ar: "عرض مرسل" }, value: "proposal-sent" },
        { label: { en: "Won", ar: "فاز" }, value: "won" },
        { label: { en: "Lost", ar: "خسر" }, value: "lost" },
        { label: { en: "Spam", ar: "Spam" }, value: "spam" },
      ],
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "normal",
      admin: { position: "sidebar" },
      options: [
        { label: { en: "Low", ar: "منخفضة" }, value: "low" },
        { label: { en: "Normal", ar: "عادية" }, value: "normal" },
        { label: { en: "High", ar: "عالية" }, value: "high" },
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
        { label: { en: "Phone", ar: "هاتف" }, value: "phone" },
        { label: { en: "WhatsApp", ar: "واتساب" }, value: "whatsapp" },
        { label: { en: "Email", ar: "بريد إلكتروني" }, value: "email" },
      ],
    },
    { name: "service", type: "relationship", relationTo: "solutions" },
    { name: "serviceSlug", type: "text", admin: { description: { en: "Service value as submitted by the form (fallback when it can't be linked to a Solution record).", ar: "قيمة الخدمة كما أُرسلت من النموذج (احتياطي إن تعذّر ربطها بسجل حل)." } } },
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
