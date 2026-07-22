import type { GlobalConfig } from "payload";
import { isSuperAdmin } from "../access";

export const NotificationSettings: GlobalConfig = {
  slug: "notification-settings",
  label: "إعدادات الإشعارات",
  access: { read: isSuperAdmin, update: isSuperAdmin },
  fields: [
    { name: "teamNotificationEmail", type: "email", admin: { description: "البريد الذي يستقبل تنبيه عند وصول طلب جديد." } },
    { name: "slaResponseTextAr", type: "text", defaultValue: "نتواصل معكم خلال يوم عمل واحد لتحديد موعد المعاينة" },
    { name: "slaResponseTextEn", type: "text", defaultValue: "We respond within one business day to schedule a site visit" },
    { name: "notifyOnNewLead", type: "checkbox", defaultValue: true },
    { name: "notifyOnNewJobApplication", type: "checkbox", defaultValue: true },
  ],
};
