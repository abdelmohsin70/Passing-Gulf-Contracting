import type { CollectionConfig } from "payload";
import { ROLES, isSuperAdmin, authenticated } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: { ar: "النظام والمستخدمون", en: "System & Users" },
    useAsTitle: "name",
    defaultColumns: ["name", "email", "roles", "active"],
    description: { en: "Access panel: who can sign in to the dashboard and their role.", ar: "لوحة الوصول: من يستطيع الدخول للوحة التحكم ودوره." },
  },
  auth: {
    // Keep sessions reasonably short for an internal admin tool.
    tokenExpiration: 60 * 60 * 8,
    maxLoginAttempts: 8,
    lockTime: 10 * 60 * 1000,
  },
  access: {
    // Anyone signed in can read the (limited) user list to populate
    // "assigned to" pickers on Leads; only a super-admin manages accounts.
    read: authenticated,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
    admin: authenticated,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      defaultValue: ["viewer"],
      options: ROLES.map((role) => ({ label: roleLabel(role), value: role })),
      admin: {
        description: { en: "super-admin: full access · content-manager: content & media · sales: leads & clients · analyst: reports only · viewer: read only.", ar: "super-admin: كل الصلاحيات · content-manager: المحتوى والوسائط · sales: الطلبات والعملاء · analyst: التقارير فقط · viewer: قراءة فقط." },
      },
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: { description: { en: "Turn this off to block the user's sign-in without deleting their account.", ar: "عطّل هذا الخيار لإيقاف دخول المستخدم دون حذف حسابه." } },
    },
  ],
  timestamps: true,
};

function roleLabel(role: string): { en: string; ar: string } {
  const labels: Record<string, { en: string; ar: string }> = {
    "super-admin": { en: "Super admin", ar: "مدير عام" },
    "content-manager": { en: "Content manager", ar: "مدير محتوى" },
    sales: { en: "Sales", ar: "مبيعات" },
    analyst: { en: "Analyst", ar: "محلل" },
    viewer: { en: "Viewer", ar: "قراءة فقط" },
  };
  return labels[role] ?? { en: role, ar: role };
}
