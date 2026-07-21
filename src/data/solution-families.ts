import type { Bilingual } from "./process";

export type SolutionFamily = {
  id: string;
  title: Bilingual;
  description: Bilingual;
  solutionSlugs: string[];
  /** The slug to link to when the family card itself is clicked. */
  primarySlug: string;
};

export const solutionFamilies: SolutionFamily[] = [
  {
    id: "operations",
    title: { ar: "إدارة المرافق والتشغيل والصيانة", en: "Facility Management & Maintenance" },
    description: {
      ar: "العمود الفقري لعلاقتنا مع عملائنا: تشغيل يومي وصيانة وقائية وتصحيحية تحمي أصولك.",
      en: "The backbone of our client relationships: daily operation and preventive/corrective maintenance that protects your assets.",
    },
    solutionSlugs: ["facility-management"],
    primarySlug: "facility-management",
  },
  {
    id: "soft-services",
    title: { ar: "النظافة والخدمات الناعمة والضيافة", en: "Cleaning, Soft Services & Hospitality" },
    description: {
      ar: "نظافة متخصصة وضيافة وكوادر تشغيلية تُبقي بيئة عملك صحية ومرحّبة.",
      en: "Specialized cleaning, hospitality, and operational staffing that keep your environment healthy and welcoming.",
    },
    solutionSlugs: ["cleaning-soft-services", "hospitality-workforce", "pest-control"],
    primarySlug: "cleaning-soft-services",
  },
  {
    id: "projects",
    title: { ar: "الترميم والتجديد واللاندسكيب", en: "Renovation & Landscaping" },
    description: {
      ar: "مشاريع تأهيل معمارية ومدنية وMEP، وحدائق تعكس مستوى منشأتك.",
      en: "Architectural, civil, and MEP rehabilitation projects, plus landscapes that reflect your facility's standard.",
    },
    solutionSlugs: ["renovation-projects", "landscape-agriculture"],
    primarySlug: "renovation-projects",
  },
  {
    id: "specialized",
    title: { ar: "الخدمات المتخصصة", en: "Specialized Services" },
    description: {
      ar: "من المطارات إلى العناية المنزلية الشاملة — خبرة متخصصة عند الحاجة إليها.",
      en: "From airports to total home care — specialized expertise exactly when you need it.",
    },
    solutionSlugs: ["airport-services", "home-care"],
    primarySlug: "airport-services",
  },
];
