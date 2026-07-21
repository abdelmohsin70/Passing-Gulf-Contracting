import type { Bilingual } from "./process";

export type Outcome = {
  id: string;
  title: Bilingual;
  description: Bilingual;
};

export const outcomes: Outcome[] = [
  {
    id: "downtime",
    title: { ar: "تقليل التوقف", en: "Reduced Downtime" },
    description: {
      ar: "صيانة وقائية مجدولة تكتشف المشكلات قبل أن تُعطّل عملك.",
      en: "Scheduled preventive maintenance catches problems before they stop your operations.",
    },
  },
  {
    id: "cost",
    title: { ar: "ضبط التكلفة", en: "Controlled Cost" },
    description: {
      ar: "مورّد واحد وخطة تشغيل واضحة بدل فواتير متفرقة من موردين متعددين.",
      en: "One accountable partner and a clear operating plan instead of scattered invoices from many vendors.",
    },
  },
  {
    id: "lifespan",
    title: { ar: "إطالة عمر الأصل", en: "Longer Asset Life" },
    description: {
      ar: "برامج صيانة دورية تحافظ على معداتك ومرافقك لأطول فترة تشغيلية ممكنة.",
      en: "Regular maintenance programs keep your equipment and facilities running longer.",
    },
  },
  {
    id: "safety",
    title: { ar: "السلامة", en: "Safety" },
    description: {
      ar: "التزام صارم بمعايير الصحة والسلامة المهنية في كل موقع نعمل فيه.",
      en: "Strict adherence to health and safety standards at every site we operate in.",
    },
  },
];
