import type { GlobalConfig } from "payload";
import { isSuperAdmin } from "../access";

export const NotificationSettings: GlobalConfig = {
  slug: "notification-settings",
  admin: {
    group: { ar: "الإعدادات", en: "Settings" },
  },
  label: { en: "Notification Settings", ar: "إعدادات الإشعارات" },
  access: { read: isSuperAdmin, update: isSuperAdmin },
  fields: [
    { name: "teamNotificationEmail", type: "email", admin: { description: { en: "The inbox that receives an alert when a new lead arrives.", ar: "البريد الذي يستقبل تنبيه عند وصول طلب جديد." } } },
    { name: "slaResponseTextAr", type: "text", defaultValue: "نتواصل معكم خلال يوم عمل واحد لتحديد موعد المعاينة" },
    { name: "slaResponseTextEn", type: "text", defaultValue: "We respond within one business day to schedule a site visit" },
    { name: "notifyOnNewLead", type: "checkbox", defaultValue: true },
    { name: "notifyOnNewJobApplication", type: "checkbox", defaultValue: true },
  ],
};
