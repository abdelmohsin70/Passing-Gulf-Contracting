/**
 * Central, typed source of truth for every fact about the company that can
 * change (contact details, legal name, certifications, coverage, etc).
 *
 * Fields marked `TODO_VERIFY` must be confirmed with the client before
 * launch. Never invent values for these — the UI is written to hide the
 * related element gracefully when a value is null/pending.
 */

export type VerifiableField<T> = {
  value: T;
  status: "confirmed" | "pending";
};

function confirmed<T>(value: T): VerifiableField<T> {
  return { value, status: "confirmed" };
}

function pending<T>(value: T): VerifiableField<T> {
  return { value, status: "pending" };
}

export const company = {
  nameAr: "شركة اجتياز الخليج للمقاولات",
  nameArShort: "اجتياز الخليج",
  // TODO_VERIFY: legal English name has not been confirmed by the client yet.
  // The brochure uses "The Passing Gulf Contracting Company", but the
  // strategy brief explicitly asks not to carry that phrasing into the
  // English site. Using a placeholder that must be confirmed before launch.
  nameEn: pending("Ijtiyaz Al Khaleej Contracting"),
  nameEnShort: "Ijtiyaz Al Khaleej",

  foundedYear: 2015,
  foundedCity: { ar: "الرياض", en: "Riyadh" },

  // TODO_VERIFY: district text extracted from the PDF ("Alsaadah District")
  // is unconfirmed and the building/street details are missing entirely.
  address: pending({
    ar: "الرياض، حي السعادة، المملكة العربية السعودية",
    en: "Riyadh, Al Saadah District, Kingdom of Saudi Arabia",
  }),

  // TODO_VERIFY: the phone number in the source PDF is stored as
  // Arabic-Indic digits that may have been extracted out of order. Do not
  // publish it until confirmed. UI hides call-to-action buttons that read
  // this field while status is "pending".
  phone: pending<string | null>(null),
  phoneDisplay: pending<string | null>(null),

  // TODO_VERIFY: WhatsApp business number not confirmed.
  whatsapp: pending<string | null>(null),

  // TODO_VERIFY: email appears in the brochure but must be confirmed as the
  // correct inbox to receive live leads before publishing.
  email: pending("passinggulf.cc@outlook.sa"),

  // TODO_VERIFY: commercial registration / VAT numbers not supplied.
  commercialRegistrationNumber: pending<string | null>(null),
  vatNumber: pending<string | null>(null),

  socials: {
    // TODO_VERIFY: no verified social profile links were supplied.
    instagram: pending<string | null>(null),
    linkedin: pending<string | null>(null),
    x: pending<string | null>(null),
  },

  coverage: {
    ar: "جميع مناطق المملكة العربية السعودية",
    en: "All regions of the Kingdom of Saudi Arabia",
  },

  availability: {
    ar: "خدمة الطوارئ الفنية على مدار الساعة",
    en: "24/7 technical emergency response",
  },

  // TODO_VERIFY: ISO certificate numbers/issuers are referenced in the
  // brochure but no valid, dated certificate copies were supplied. Keep
  // status "pending" until the client provides current certificates.
  certifications: [
    { code: "ISO 9001:2015", label: { ar: "إدارة الجودة", en: "Quality Management" }, status: "pending" as const },
    { code: "ISO 14001:2015", label: { ar: "الإدارة البيئية", en: "Environmental Management" }, status: "pending" as const },
    { code: "ISO 45001:2018", label: { ar: "الصحة والسلامة المهنية", en: "Occupational Health & Safety" }, status: "pending" as const },
  ],

  quoteResponseTime: {
    // Qualitative only — no fabricated SLA numbers.
    ar: "نتواصل معكم خلال يوم عمل واحد لتحديد موعد المعاينة",
    en: "We respond within one business day to schedule a site visit",
  },
} as const;

export function isFieldConfirmed<T>(field: VerifiableField<T>): boolean {
  return field.status === "confirmed";
}

export { confirmed, pending };
