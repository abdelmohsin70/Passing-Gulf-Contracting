import type { Bilingual } from "./process";

export type CaseStudy = {
  slug: string;
  /**
   * When true, this entry is an illustrative template only — its content
   * uses bracketed placeholders and must never be presented as a completed,
   * real project. It exists solely to show editors and the client the
   * intended shape of a real case study before real project data is
   * supplied. Set to false only once real, verified project data replaces
   * every placeholder field.
   */
  isPlaceholder: boolean;
  clientLabel: Bilingual;
  sectorSlug: string;
  solutionSlug: string;
  city: Bilingual;
  scope: Bilingual;
  challenge: Bilingual;
  approach: Bilingual;
  result: Bilingual;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "case-study-template",
    isPlaceholder: true,
    clientLabel: { ar: "[اسم العميل — TODO_VERIFY]", en: "[Client Name — TODO_VERIFY]" },
    sectorSlug: "commercial-admin",
    solutionSlug: "facility-management",
    city: { ar: "[المدينة]", en: "[City]" },
    scope: {
      ar: "[نطاق العمل: مثال — تشغيل وصيانة مبنى إداري بمساحة كذا لمدة كذا]",
      en: "[Scope of work: e.g. operation & maintenance of an office building of a given size over a given period]",
    },
    challenge: {
      ar: "[التحدي الذي واجهه العميل قبل التعاقد معنا]",
      en: "[The challenge the client faced before engaging us]",
    },
    approach: {
      ar: "[الحل والمنهجية التي طبقناها لمعالجة التحدي]",
      en: "[The solution and methodology we applied to address the challenge]",
    },
    result: {
      ar: "[النتيجة الموثقة بعد التنفيذ — لا تُنشر أرقام إلا بعد تأكيدها مع العميل]",
      en: "[The documented result after execution — figures are published only once confirmed with the client]",
    },
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((item) => item.slug === slug);
}
