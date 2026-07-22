import type { GlobalConfig } from "payload";
import { anyone, isSuperAdmin } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "إعدادات الشركة",
  access: { read: anyone, update: isSuperAdmin },
  fields: [
    { name: "nameAr", type: "text", required: true, defaultValue: "شركة اجتياز الخليج للمقاولات" },
    {
      name: "nameEn",
      type: "text",
      required: true,
      defaultValue: "Ijtiyaz Al Khaleej Contracting",
      admin: { description: "TODO_VERIFY: الاسم القانوني الإنجليزي المعتمد لم يُؤكَّد بعد." },
    },
    { name: "nameEnStatus", type: "select", defaultValue: "pending", options: [{ label: "قيد التوثيق", value: "pending" }, { label: "مؤكَّد", value: "confirmed" }] },
    { name: "foundedYear", type: "number", defaultValue: 2015 },
    { name: "foundedCityAr", type: "text", defaultValue: "الرياض" },
    { name: "foundedCityEn", type: "text", defaultValue: "Riyadh" },
    { name: "commercialRegistrationNumber", type: "text", admin: { description: "TODO_VERIFY" } },
    { name: "vatNumber", type: "text", admin: { description: "TODO_VERIFY" } },
  ],
};
