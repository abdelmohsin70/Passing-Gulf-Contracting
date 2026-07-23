import type { CollectionConfig } from "payload";
import { isSuperAdmin, systemWriteOnly } from "../access";

/**
 * Written only by server-side code (hooks on other collections, using the
 * Local API with overrideAccess). Never accept writes through the public
 * REST API or the admin UI directly — hence `create`/`update`/`delete` are
 * all locked to `systemWriteOnly` (always false) at the access-control
 * layer; internal code bypasses this deliberately via `overrideAccess`.
 */
export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  labels: { singular: { en: "Audit Log", ar: "سجل تدقيق" }, plural: { en: "Audit Logs", ar: "سجلات التدقيق" } },
  admin: {
    group: { ar: "النظام والمستخدمون", en: "System & Users" },
    useAsTitle: "action",
    defaultColumns: ["actor", "action", "collectionSlug", "timestamp"],
    description: "سجل تلقائي للعمليات الحساسة — للقراءة فقط، لا يمكن تعديله من الواجهة.",
  },
  access: {
    read: isSuperAdmin,
    create: systemWriteOnly,
    update: systemWriteOnly,
    delete: systemWriteOnly,
  },
  fields: [
    { name: "actor", type: "relationship", relationTo: "users" },
    { name: "action", type: "text", required: true },
    { name: "collectionSlug", type: "text" },
    { name: "documentId", type: "text" },
    { name: "safeSummary", type: "text", admin: { description: "وصف مختصر لا يحتوي أسرارًا أو بيانات شخصية كاملة." } },
    { name: "timestamp", type: "date", required: true, defaultValue: () => new Date().toISOString() },
  ],
  timestamps: false,
};
