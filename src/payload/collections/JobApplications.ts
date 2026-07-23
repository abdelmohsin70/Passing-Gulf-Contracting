import type { CollectionConfig } from "payload";
import { isSalesTeam, isSuperAdmin } from "../access";

export const JobApplications: CollectionConfig = {
  slug: "job-applications",
  labels: { singular: { en: "Job Application", ar: "طلب توظيف" }, plural: { en: "Job Applications", ar: "طلبات التوظيف" } },
  admin: {
    group: { ar: "التوظيف", en: "Recruitment" },
    useAsTitle: "name",
    defaultColumns: ["name", "areaOfInterest", "status", "createdAt"],
  },
  access: {
    read: isSalesTeam,
    create: isSalesTeam,
    update: isSalesTeam,
    delete: isSuperAdmin,
  },
  fields: [
    { name: "vacancy", type: "relationship", relationTo: "careers" },
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", required: true },
    { name: "areaOfInterest", type: "text", required: true },
    { name: "message", type: "textarea" },
    { name: "cv", type: "upload", relationTo: "media" },
    { name: "consentAt", type: "date" },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: { en: "New", ar: "جديد" }, value: "new" },
        { label: { en: "Under review", ar: "قيد المراجعة" }, value: "reviewing" },
        { label: { en: "Interview", ar: "مقابلة" }, value: "interview" },
        { label: { en: "Rejected", ar: "مرفوض" }, value: "rejected" },
        { label: { en: "Accepted", ar: "مقبول" }, value: "hired" },
      ],
    },
    { name: "notes", type: "textarea" },
    { name: "assignedTo", type: "relationship", relationTo: "users" },
  ],
  timestamps: true,
};
