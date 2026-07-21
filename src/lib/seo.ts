import type { Locale } from "@/i18n/config";
import { company } from "@/config/company";

function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
}

export function organizationJsonLd(locale: Locale) {
  const url = siteUrl();
  const name = locale === "ar" ? company.nameAr : company.nameEn.value;

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name,
    url: `${url}/${locale}`,
    foundingDate: String(company.foundedYear),
    areaServed: {
      "@type": "Country",
      name: "SA",
    },
    ...(company.email.status === "confirmed" ? { email: company.email.value } : {}),
    ...(company.phone.status === "confirmed" && company.phone.value ? { telephone: company.phone.value } : {}),
  };
}

export function localBusinessJsonLd(locale: Locale) {
  const url = siteUrl();
  const name = locale === "ar" ? company.nameAr : company.nameEn.value;

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#localbusiness`,
    name,
    url: `${url}/${locale}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: company.foundedCity[locale],
      addressCountry: "SA",
    },
    ...(company.phone.status === "confirmed" && company.phone.value ? { telephone: company.phone.value } : {}),
  };
}

export function breadcrumbJsonLd(items: { label: string; href: string }[]) {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${url}${item.href}`,
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  locale,
  slug,
}: {
  name: string;
  description: string;
  locale: Locale;
  slug: string;
}) {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    description,
    url: `${url}/${locale}/solutions/${slug}`,
    provider: {
      "@type": "Organization",
      name: locale === "ar" ? company.nameAr : company.nameEn.value,
    },
    areaServed: {
      "@type": "Country",
      name: "SA",
    },
  };
}

export { siteUrl };
