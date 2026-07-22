import type { CollectionConfig } from "payload";
import path from "path";
import { fileURLToPath } from "url";
import { anyone, isContentEditor } from "../access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "altEn",
    defaultColumns: ["filename", "altAr", "category", "usageApproved"],
    description: "مكتبة الصور والملفات — لكل صورة نص بديل بالعربي والإنجليزي.",
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
      label: "النص البديل (عربي)",
    },
    {
      name: "altEn",
      type: "text",
      required: true,
      label: "Alt text (English)",
    },
    {
      name: "captionAr",
      type: "text",
      label: "تعليق الصورة (عربي)",
    },
    {
      name: "captionEn",
      type: "text",
      label: "Caption (English)",
    },
    {
      name: "credit",
      type: "text",
      label: "مصدر الصورة / التصوير",
      admin: { description: "مثال: تصوير ميداني — اجتياز الخليج، 2026." },
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "فريق العمل", value: "team" },
        { label: "مواقع العمل", value: "sites" },
        { label: "معدات", value: "equipment" },
        { label: "مشاريع", value: "projects" },
        { label: "شعارات عملاء", value: "client-logos" },
        { label: "أخرى", value: "other" },
      ],
    },
    {
      name: "tags",
      type: "text",
      hasMany: true,
    },
    {
      name: "usageApproved",
      type: "checkbox",
      defaultValue: false,
      label: "معتمد للنشر",
      admin: {
        description:
          "اترك هذا الخيار غير مفعّل لأي صورة (خصوصًا شعارات العملاء) حتى تصل موافقة استخدام موثقة.",
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
