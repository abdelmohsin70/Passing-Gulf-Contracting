import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";
import { anyone, isContentEditor } from "../access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    group: { ar: "الوسائط", en: "Media" },
    useAsTitle: "altEn",
    defaultColumns: ["filename", "altAr", "category", "usageApproved"],
    description: { en: "Library of images and files — each image has Arabic and English alt text.", ar: "مكتبة الصور والملفات — لكل صورة نص بديل بالعربي والإنجليزي." },
  },
  access: {
    read: anyone,
    create: isContentEditor,
    update: isContentEditor,
    delete: isContentEditor,
  },
  fields: [
    {
      name: "altAr",
      type: "text",
      required: true,
      label: { en: "Alt text (Arabic)", ar: "النص البديل (عربي)" },
    },
    {
      name: "altEn",
      type: "text",
      required: true,
      label: { en: "Alt text (English)", ar: "النص البديل (إنجليزي)" },
    },
    {
      name: "captionAr",
      type: "text",
      label: { en: "Image caption (Arabic)", ar: "تعليق الصورة (عربي)" },
    },
    {
      name: "captionEn",
      type: "text",
      label: { en: "Caption (English)", ar: "تعليق الصورة (إنجليزي)" },
    },
    {
      name: "credit",
      type: "text",
      label: { en: "Image / photography source", ar: "مصدر الصورة / التصوير" },
      admin: { description: { en: "e.g. Field photography — Ijtiyaz Al Khaleej, 2026.", ar: "مثال: تصوير ميداني — اجتياز الخليج، 2026." } },
    },
    {
      name: "category",
      type: "select",
      label: { en: "Category", ar: "التصنيف" },
      options: [
        { label: { en: "Team", ar: "فريق العمل" }, value: "team" },
        { label: { en: "Job locations", ar: "مواقع العمل" }, value: "sites" },
        { label: { en: "Equipment", ar: "معدات" }, value: "equipment" },
        { label: { en: "Projects", ar: "مشاريع" }, value: "projects" },
        { label: { en: "Client logos", ar: "شعارات عملاء" }, value: "client-logos" },
        { label: { en: "Other", ar: "أخرى" }, value: "other" },
      ],
    },
    {
      name: "tags",
      type: "text",
      hasMany: true,
      label: { en: "Tags", ar: "وسوم" },
    },
    {
      name: "usageApproved",
      type: "checkbox",
      defaultValue: false,
      label: { en: "Approved for publishing", ar: "معتمد للنشر" },
      admin: {
        description: { en: "Leave this off for any image (especially client logos) until documented usage approval is received.", ar: "اترك هذا الخيار غير مفعّل لأي صورة (خصوصًا شعارات العملاء) حتى تصل موافقة استخدام موثقة." },
      },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, "../../../public/media"),
    adminThumbnail: "thumbnail",
    focalPoint: true,
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 300 },
      { name: "card", width: 640, height: 480, crop: "center" },
      { name: "hero", width: 1600, height: 900, crop: "center" },
      { name: "og", width: 1200, height: 630, crop: "center" },
    ],
  },
};
