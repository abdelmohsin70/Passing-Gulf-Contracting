import type { CollectionConfig } from "payload";
import { isSalesTeam, isSuperAdmin } from "../access";

export const LeadActivities: CollectionConfig = {
  slug: "lead-activities",
  labels: { singular: { en: "Lead Activity", ar: "نشاط على طلب" }, plural: { en: "Lead Activities", ar: "سجل أنشطة الطلبات" } },
  admin: {
    useAsTitle: "type",
    defaultColumns: ["lead", "type", "actor", "occurredAt"],
    description: { en: "Automatic log of every note or status change on a lead — read and add only.", ar: "سجل تلقائي بكل ملاحظة أو تغيير حالة على طلب — للقراءة والإضافة فقط." },
    group: { ar: "المبيعات والطلبات", en: "Sales & Leads" },
  },
  access: {
    read: isSalesTeam,
    create: isSalesTeam,
    // Append-only: activity history isn't meant to be edited after the
    // fact, only a super-admin can correct/remove a bad entry.
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    { name: "lead", type: "relationship", relationTo: "leads", required: true },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: { en: "Note", ar: "ملاحظة" }, value: "note" },
        { label: { en: "Change status", ar: "تغيير حالة" }, value: "status-change" },
        { label: { en: "Assign owner", ar: "تعيين مسؤول" }, value: "assignment" },
        { label: { en: "Call", ar: "مكالمة" }, value: "call" },
        { label: { en: "Email", ar: "بريد إلكتروني" }, value: "email" },
        { label: { en: "Visit", ar: "زيارة" }, value: "visit" },
      ],
    },
    { name: "note", type: "textarea" },
    { name: "fromStatus", type: "text" },
    { name: "toStatus", type: "text" },
    { name: "actor", type: "relationship", relationTo: "users" },
    { name: "occurredAt", type: "date", defaultValue: () => new Date().toISOString() },
  ],
  timestamps: true,
};
