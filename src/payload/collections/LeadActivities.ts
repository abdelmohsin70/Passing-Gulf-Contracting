import type { CollectionConfig } from "payload";
import { isSalesTeam, isSuperAdmin } from "../access";

export const LeadActivities: CollectionConfig = {
  slug: "lead-activities",
  labels: { singular: "نشاط على طلب", plural: "سجل أنشطة الطلبات" },
  admin: {
    useAsTitle: "type",
    defaultColumns: ["lead", "type", "actor", "occurredAt"],
    description: "سجل تلقائي بكل ملاحظة أو تغيير حالة على طلب — للقراءة والإضافة فقط.",
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
        { label: "ملاحظة", value: "note" },
        { label: "تغيير حالة", value: "status-change" },
        { label: "تعيين مسؤول", value: "assignment" },
        { label: "مكالمة", value: "call" },
        { label: "بريد إلكتروني", value: "email" },
        { label: "زيارة", value: "visit" },
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
