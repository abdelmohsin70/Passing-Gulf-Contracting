import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSolutionBySlug } from "@/data/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { QuoteWizard } from "@/components/forms/QuoteWizard";
import { ContactCard } from "@/components/sections/ContactCard";
import { localBusinessJsonLd } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.contact.title,
    description: dictionary.contact.subtitle,
    alternates: { canonical: `/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ service?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { service } = await searchParams;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;
  const initialService = service && getSolutionBySlug(service) ? service : undefined;
  const localBusinessSchema = localBusinessJsonLd(locale);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.contact.title }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.contact.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{dictionary.contact.subtitle}</p>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
            <QuoteWizard locale={locale} dictionary={dictionary} initialService={initialService} />
            <ContactCard locale={locale} dictionary={dictionary} />
          </div>
        </Container>
      </Section>
    </>
  );
}
