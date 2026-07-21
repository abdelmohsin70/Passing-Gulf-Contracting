import type { Bilingual } from "./process";

export type Sector = {
  slug: string;
  icon:
    | "office"
    | "health"
    | "residential"
    | "industrial"
    | "education"
    | "airport"
    | "government";
  title: Bilingual;
  description: Bilingual;
  relevantSolutions: string[];
};

export const sectors: Sector[] = [
  {
    slug: "commercial-admin",
    icon: "office",
    title: { ar: "التجاري والإداري", en: "Commercial & Office" },
    description: {
      ar: "مراكز تجارية ومباني إدارية تحتاج تشغيلًا مستمرًا ونظافة عالية المستوى تحافظ على تجربة الزوار والموظفين.",
      en: "Malls and office buildings that need continuous operation and high-standard cleanliness for visitors and staff alike.",
    },
    relevantSolutions: ["facility-management", "cleaning-soft-services", "hospitality-workforce"],
  },
  {
    slug: "healthcare",
    icon: "health",
    title: { ar: "الصحي", en: "Healthcare" },
    description: {
      ar: "منشآت طبية تتطلب أعلى معايير التعقيم والنظافة المتخصصة والصيانة دون انقطاع للخدمة.",
      en: "Medical facilities that require the strictest sanitization, specialized cleaning, and maintenance without service interruption.",
    },
    relevantSolutions: ["cleaning-soft-services", "facility-management", "pest-control"],
  },
  {
    slug: "residential-hospitality",
    icon: "residential",
    title: { ar: "السكني والضيافة", en: "Residential & Hospitality" },
    description: {
      ar: "مجمعات سكنية وفنادق وقصور تحتاج إدارة مرافق دقيقة وضيافة تليق بضيوفها وسكانها.",
      en: "Residential compounds, hotels, and palaces that need precise facility management and hospitality worthy of their guests.",
    },
    relevantSolutions: ["facility-management", "hospitality-workforce", "landscape-agriculture", "home-care"],
  },
  {
    slug: "industrial-logistics",
    icon: "industrial",
    title: { ar: "الصناعي واللوجستي", en: "Industrial & Logistics" },
    description: {
      ar: "مصانع ومستودعات تعتمد على استمرارية المعدات وسلامة الموقع وكوادر تشغيلية جاهزة.",
      en: "Factories and warehouses that depend on equipment uptime, site safety, and ready operational manpower.",
    },
    relevantSolutions: ["facility-management", "hospitality-workforce", "pest-control"],
  },
  {
    slug: "education",
    icon: "education",
    title: { ar: "التعليم", en: "Education" },
    description: {
      ar: "مدارس وجامعات تحتاج بيئة نظيفة وآمنة للطلاب مع صيانة دورية لا تعطّل اليوم الدراسي.",
      en: "Schools and universities that need a clean, safe environment for students with maintenance that never disrupts the school day.",
    },
    relevantSolutions: ["cleaning-soft-services", "facility-management", "pest-control"],
  },
  {
    slug: "airports-transport",
    icon: "airport",
    title: { ar: "المطارات والنقل", en: "Airports & Transport" },
    description: {
      ar: "خدمات أرضية ونظافة متخصصة للمطارات المحلية والدولية، مع مساعدة مخصصة لذوي الهمم.",
      en: "Specialized ground services and cleaning for domestic and international airports, including assistance for passengers with disabilities.",
    },
    relevantSolutions: ["airport-services", "cleaning-soft-services"],
  },
  {
    slug: "government",
    icon: "government",
    title: { ar: "الجهات الحكومية", en: "Government" },
    description: {
      ar: "جهات حكومية تحتاج شريك تشغيل موثوق يلتزم بالمعايير والإجراءات الرسمية على نطاق المملكة.",
      en: "Government entities that need a reliable operating partner committed to official standards and procedures nationwide.",
    },
    relevantSolutions: ["facility-management", "cleaning-soft-services", "renovation-projects"],
  },
];
