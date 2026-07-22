import type { Bilingual } from "./process";

export type CaseStudy = {
  slug: string;
  /**
   * When true, this entry is an illustrative example, not a documented real
   * engagement. It uses anonymized (sector-based) client descriptions and
   * representative figures to show the intended shape of a case study before
   * real, named, client-approved project data is supplied. Every card and
   * detail page for a placeholder renders the "illustrative example" badge
   * and is excluded from search indexing. Set to false only once real,
   * verified, client-approved data replaces it (managed in the CMS).
   */
  isPlaceholder: boolean;
  clientLabel: Bilingual;
  sectorSlug: string;
  solutionSlug: string;
  city: Bilingual;
  /** Optional work-site photo (path under /public). */
  image?: string;
  scope: Bilingual;
  challenge: Bilingual;
  approach: Bilingual;
  result: Bilingual;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "commercial-tower-facility-management",
    isPlaceholder: true,
    clientLabel: { ar: "برج مكاتب تجاري — الرياض", en: "Commercial Office Tower — Riyadh" },
    sectorSlug: "commercial-admin",
    solutionSlug: "facility-management",
    city: { ar: "الرياض", en: "Riyadh" },
    image: "/images/facility-management-banner.jpg",
    scope: {
      ar: "إدارة مرافق متكاملة (تشغيل وصيانة) لبرج مكاتب من عدة طوابق: أنظمة التكييف المركزي، الكهرباء، السباكة، المصاعد، والنظافة العامة، مع مركز بلاغات موحّد على مدار الساعة.",
      en: "Integrated facility management (operation & maintenance) for a multi-floor office tower: central HVAC, electrical, plumbing, elevators, and general cleaning, with a unified 24/7 help desk.",
    },
    challenge: {
      ar: "كان المالك يتعامل مع عدة مقاولين منفصلين لكل تخصص، ما تسبب في تأخر معالجة الأعطال، غياب صيانة وقائية منتظمة، وشكاوى متكررة من المستأجرين حول التكييف والمصاعد.",
      en: "The owner was dealing with several separate contractors per trade, causing slow fault resolution, no regular preventive maintenance, and recurring tenant complaints about HVAC and elevators.",
    },
    approach: {
      ar: "وحّدنا التشغيل تحت عقد واحد بفريق مقيم في الموقع، وبنينا جدول صيانة وقائية شهري لكل الأصول، وربطنا البلاغات بنظام تتبّع يقيس زمن الاستجابة والإغلاق، مع تقرير أداء شهري للمالك.",
      en: "We consolidated operations under a single contract with an on-site resident team, built a monthly preventive-maintenance schedule for every asset, and linked fault reports to a tracking system that measures response and closure times, with a monthly performance report for the owner.",
    },
    result: {
      ar: "انتظام الصيانة الوقائية قلّل الأعطال الطارئة، وتحسّن زمن الاستجابة للبلاغات بشكل ملموس، مع نقطة تواصل واحدة بدل عدة مقاولين. (أرقام توضيحية — تُعتمد الأرقام الفعلية بعد التوثيق مع العميل.)",
      en: "Regular preventive maintenance reduced emergency faults, report response time improved noticeably, and the owner now has a single point of contact instead of several contractors. (Illustrative figures — actual numbers are confirmed once documented with the client.)",
    },
  },
  {
    slug: "healthcare-facility-specialized-cleaning",
    isPlaceholder: true,
    clientLabel: { ar: "منشأة رعاية صحية — المنطقة الوسطى", en: "Healthcare Facility — Central Region" },
    sectorSlug: "healthcare",
    solutionSlug: "cleaning-soft-services",
    city: { ar: "الرياض", en: "Riyadh" },
    image: "/images/cleaning-soft-services-banner.jpg",
    scope: {
      ar: "خدمات نظافة وتعقيم متخصصة لمنشأة صحية تشمل مناطق المرضى، غرف العمليات، والمناطق العامة، وفق بروتوكولات مكافحة العدوى ومعايير التعقيم المعتمدة.",
      en: "Specialized cleaning and disinfection for a healthcare facility covering patient areas, operating rooms, and public zones, following infection-control protocols and approved sterilization standards.",
    },
    challenge: {
      ar: "تتطلب البيئة الصحية معايير نظافة أعلى من المعتاد بكثير، مع حساسية عالية لأي انقطاع في الخدمة أو استخدام مواد غير معتمدة، وكوادر مدرّبة على التعامل داخل بيئة طبية.",
      en: "A healthcare environment demands far higher cleaning standards than usual, high sensitivity to any service interruption or use of unapproved materials, and staff trained to work inside a medical setting.",
    },
    approach: {
      ar: "وفّرنا كوادر مدرّبة على بروتوكولات مكافحة العدوى، بجدول تنظيف مبني على تصنيف المخاطر لكل منطقة، ومواد وأدوات معتمدة مخصصة للقطاع الصحي، مع إشراف ميداني يومي وتوثيق للمهام.",
      en: "We deployed staff trained in infection-control protocols, a risk-based cleaning schedule per zone, approved materials and color-coded tools dedicated to healthcare, with daily on-site supervision and task documentation.",
    },
    result: {
      ar: "بيئة أنظف وأكثر أمانًا للمرضى والكادر الطبي، مع التزام مستقر بمعايير التعقيم دون انقطاع في الخدمة. (أرقام توضيحية — تُعتمد بعد التوثيق مع العميل.)",
      en: "A cleaner, safer environment for patients and medical staff, with stable adherence to sterilization standards and no service interruption. (Illustrative figures — confirmed once documented with the client.)",
    },
  },
  {
    slug: "airport-ground-services",
    isPlaceholder: true,
    clientLabel: { ar: "مشغّل مطار — المنطقة الغربية", en: "Airport Operator — Western Region" },
    sectorSlug: "airports-transport",
    solutionSlug: "airport-services",
    city: { ar: "جدة", en: "Jeddah" },
    image: "/images/airport-services-hero.jpg",
    scope: {
      ar: "خدمات نظافة أرضية وخدمات مساندة لصالات المطار: النظافة المستمرة لمناطق الركاب، دورات المياه، ومناطق الخدمة، بالإضافة إلى مساعدة ذوي الاحتياجات ضمن معايير تشغيل المطارات.",
      en: "Ground cleaning and support services for airport terminals: continuous cleaning of passenger areas, restrooms, and service zones, plus assistance for people with reduced mobility, within airport operating standards.",
    },
    challenge: {
      ar: "بيئة المطار تعمل على مدار الساعة بكثافة حركة عالية ومعايير صارمة للمظهر والنظافة، ما يتطلب كوادر كافية بنوبات متعاقبة واستجابة فورية دون التأثير على انسيابية حركة الركاب.",
      en: "An airport runs 24/7 with high traffic and strict appearance and cleanliness standards, requiring sufficient staff across shifts and immediate response without disrupting passenger flow.",
    },
    approach: {
      ar: "نظّمنا فرق عمل بنوبات متعاقبة تغطي كامل ساعات التشغيل، بجولات نظافة دورية موثّقة، وفريق استجابة سريعة للحالات الطارئة، مع إشراف ميداني يضمن ثبات المستوى في أوقات الذروة.",
      en: "We organized rotating shift teams covering all operating hours, documented periodic cleaning rounds, and a rapid-response team for urgent cases, with on-site supervision that keeps standards stable at peak times.",
    },
    result: {
      ar: "مستوى نظافة ثابت في صالات عالية الحركة على مدار الساعة، مع استجابة أسرع للحالات الطارئة وتجربة أفضل للمسافرين. (أرقام توضيحية — تُعتمد بعد التوثيق مع العميل.)",
      en: "Consistent cleanliness in high-traffic terminals around the clock, with faster response to urgent cases and a better passenger experience. (Illustrative figures — confirmed once documented with the client.)",
    },
  },
  {
    slug: "hospitality-landscape-maintenance",
    isPlaceholder: true,
    clientLabel: { ar: "مجمّع سكني وضيافة — المنطقة الشرقية", en: "Residential & Hospitality Complex — Eastern Region" },
    sectorSlug: "residential-hospitality",
    solutionSlug: "landscape-agriculture",
    city: { ar: "الدمام", en: "Dammam" },
    image: "/images/landscape-agriculture-hero.jpg",
    scope: {
      ar: "تصميم وصيانة المسطحات الخضراء والحدائق لمجمّع سكني وضيافة: شبكات الري، تنسيق النباتات الموسمية، صيانة الأشجار، ومكافحة الآفات للمسطحات الخارجية.",
      en: "Design and maintenance of green spaces and gardens for a residential and hospitality complex: irrigation networks, seasonal planting, tree care, and pest control for outdoor areas.",
    },
    challenge: {
      ar: "كانت المساحات الخضراء تعاني من ريّ غير منتظم وهدر للمياه، مع تدهور مظهر النباتات في أشهر الصيف، ما يؤثر على انطباع الزوار والسكان في مجمّع يعتمد على جودة التجربة.",
      en: "The green areas suffered from irregular irrigation and water waste, with plant appearance deteriorating in the summer months, affecting the impression of visitors and residents in a complex that relies on experience quality.",
    },
    approach: {
      ar: "أعدنا ضبط شبكة الري لتقليل الهدر بجدولة ذكية، واخترنا نباتات مناسبة للمناخ المحلي، ووضعنا برنامج صيانة دورية للأشجار والمسطحات، مع مكافحة آفات وقائية بمواد آمنة.",
      en: "We re-tuned the irrigation network to cut waste with smart scheduling, selected plants suited to the local climate, set a periodic maintenance program for trees and lawns, and added preventive pest control with safe materials.",
    },
    result: {
      ar: "مظهر أخضر مستقر على مدار السنة مع ترشيد أوضح في استهلاك المياه، وتجربة أفضل لسكان المجمّع وزوّاره. (أرقام توضيحية — تُعتمد بعد التوثيق مع العميل.)",
      en: "A stable green appearance year-round with clearer water savings, and a better experience for the complex's residents and visitors. (Illustrative figures — confirmed once documented with the client.)",
    },
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}
