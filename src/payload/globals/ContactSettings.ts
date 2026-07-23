import type { GlobalConfig } from "payload";
import { anyone, isSuperAdmin } from "../access";

const statusOptions = [
  { label: "قيد التوثيق", value: "pending" },
  { label: "مؤكَّد", value: "confirmed" },
];

/**
 * Every contact field here ships with a `*Status` companion. The frontend
 * only renders the phone button / WhatsApp button / email link / precise
 * address when its status is "confirmed" — mirroring the TODO_VERIFY
 * pattern the static site launched with, now editable without a deploy.
 */
export const ContactSettings: GlobalConfig = {
  slug: "contact-settings",
  admin: {
    group: { ar: "الإعدادات", en: "Settings" },
  },
  label: "بيانات التواصل",
  access: { read: anyone, update: isSuperAdmin },
  fields: [
    { name: "phone", type: "text" },
    { name: "phoneDisplay", type: "text" },
    { name: "phoneStatus", type: "select", defaultValue: "pending", options: statusOptions },
    { name: "whatsapp", type: "text" },
    { name: "whatsappStatus", type: "select", defaultValue: "pending", options: statusOptions },
    { name: "email", type: "email", defaultValue: "passinggulf.cc@outlook.sa" },
    { name: "emailStatus", type: "select", defaultValue: "pending", options: statusOptions },
    { name: "addressAr", type: "textarea" },
    { name: "addressEn", type: "textarea" },
    { name: "addressStatus", type: "select", defaultValue: "pending", options: statusOptions },
    { name: "workingHoursAr", type: "text", defaultValue: "الأحد إلى الخميس، وخدمة طوارئ فنية على مدار الساعة" },
    { name: "workingHoursEn", type: "text", defaultValue: "Sunday to Thursday, with 24/7 technical emergency response" },
    {
      name: "socials",
      type: "group",
      admin: { description: "روابط كاملة لصفحات التواصل الاجتماعي (تبدأ بـ https://). تظهر في الفوتر تلقائيًا عند إضافتها." },
      fields: [
        { name: "instagram", type: "text" },
        { name: "linkedin", type: "text" },
        { name: "x", type: "text" },
        { name: "youtube", type: "text" },
        { name: "snapchat", type: "text" },
        { name: "tiktok", type: "text" },
        { name: "facebook", type: "text" },
      ],
    },
    {
      name: "certifications",
      type: "array",
      admin: { description: "شريط الشهادات المختصر في الهيدر/الفوتر (تفاصيلها الكاملة في مجموعة Certifications)." },
      fields: [
        { name: "code", type: "text" },
        { name: "labelAr", type: "text" },
        { name: "labelEn", type: "text" },
        { name: "status", type: "select", defaultValue: "pending", options: statusOptions },
      ],
    },
  ],
};
