import type { GlobalConfig } from "payload";
import { anyone, isSuperAdmin } from "../access";

export const SEOSettings: GlobalConfig = {
  slug: "seo-settings",
  admin: {
    group: { ar: "الإعدادات", en: "Settings" },
  },
  label: "إعدادات SEO العامة",
  access: { read: anyone, update: isSuperAdmin },
  fields: [
    { name: "defaultMetaTitleAr", type: "text" },
    { name: "defaultMetaTitleEn", type: "text" },
    { name: "defaultMetaDescriptionAr", type: "textarea" },
    { name: "defaultMetaDescriptionEn", type: "textarea" },
    { name: "defaultOgImage", type: "upload", relationTo: "media" },
    { name: "googleSiteVerification", type: "text" },
    { name: "robotsExtraRules", type: "textarea", admin: { description: "أسطر إضافية تُلحق بملف robots.txt عند الحاجة." } },
  ],
};
