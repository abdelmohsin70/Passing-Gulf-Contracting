export type Bilingual = { ar: string; en: string };

export type ProcessStep = {
  step: number;
  title: Bilingual;
  description: Bilingual;
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: { ar: "اكتشاف", en: "Discovery" },
    description: {
      ar: "نستمع لاحتياج منشأتك وأهدافك التشغيلية ونوع الأصول التي تديرها قبل اقتراح أي حل.",
      en: "We start by understanding your facility, operational goals, and the assets you manage before proposing anything.",
    },
  },
  {
    step: 2,
    title: { ar: "مسح وتقييم", en: "Site Survey & Assessment" },
    description: {
      ar: "زيارة ميدانية لتقييم حالة المرافق والمعدات وتحديد نقاط المخاطرة وفرص تحسين الكفاءة.",
      en: "An on-site visit to assess facility and equipment condition, flag risk points, and identify efficiency opportunities.",
    },
  },
  {
    step: 3,
    title: { ar: "خطة وSLA", en: "Plan & SLA" },
    description: {
      ar: "خطة تشغيل وصيانة مخصصة مع نطاق أعمال ومستوى خدمة واضح متفق عليه.",
      en: "A tailored operation and maintenance plan with a clear, agreed scope of work and service level.",
    },
  },
  {
    step: 4,
    title: { ar: "تشغيل ومتابعة", en: "Operate & Monitor" },
    description: {
      ar: "فرقنا الفنية تنفذ الخطة على الأرض مع متابعة يومية والتزام بمعايير الصحة والسلامة.",
      en: "Our technical crews execute the plan on the ground, with daily follow-up and strict health & safety compliance.",
    },
  },
  {
    step: 5,
    title: { ar: "تقارير وتحسين", en: "Report & Improve" },
    description: {
      ar: "تقارير دورية عن الأداء والملاحظات، ومراجعة مستمرة لرفع الكفاءة وخفض التكلفة.",
      en: "Recurring performance reporting and continuous review to raise efficiency and reduce cost over time.",
    },
  },
];
