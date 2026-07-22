import type { CollectionConfig } from "payload";
import { anyone, isContentEditor } from "../access";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "عضو فريق", plural: "أعضاء الفريق" },
  admin: {
    group: { ar: "الثقة والاعتماد", en: "Trust & Proof" },
    useAsTitle: "name",
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "roleAr", type: "text", label: "المسمى الوظيفي (عربي)" },
    { name: "roleEn", type: "text", label: "Job title (English)" },
    { name: "photo", type: "upload", relationTo: "media" },
    { name: "sortOrder", type: "number", defaultValue: 0 },
    { name: "published", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
  ],
};
