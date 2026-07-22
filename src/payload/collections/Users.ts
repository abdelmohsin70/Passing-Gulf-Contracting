import type { CollectionConfig } from "payload";
import { ROLES, isSuperAdmin, authenticated } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    group: { ar: "النظام والمستخدمون", en: "System & Users" },
    useAsTitle: "name",
    defaultColumns: ["name", "email", "roles", "active"],
    description: "لوحة الوصول: من يستطيع الدخول للوحة التحكم ودوره.",
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
        description:
          "super-admin: كل الصلاحيات · content-manager: المحتوى والوسائط · sales: الطلبات والعملاء · analyst: التقارير فقط · viewer: قراءة فقط.",
      },
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
      admin: { description: "عطّل هذا الخيار لإيقاف دخول المستخدم دون حذف حسابه." },
    },
  ],
  timestamps: true,
};

function roleLabel(role: string): string {
  const labels: Record<string, string> = {
    "super-admin": "مدير عام",
    "content-manager": "مدير محتوى",
    sales: "مبيعات",
    analyst: "محلل",
    viewer: "قراءة فقط",
  };
  return labels[role] ?? role;
}
