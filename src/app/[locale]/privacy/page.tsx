import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.privacy.title,
    alternates: { canonical: `/${locale}/privacy` },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.privacy.title }]} />
        </Container>
      </Section>

      <Section tone="white" className="pt-10">
        <Container>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.privacy.title}</h1>
            <p className="mt-3 text-sm text-slate">
              {dictionary.privacy.updated}: {new Date().toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            <p className="mt-6 leading-relaxed text-slate">{dictionary.privacy.intro}</p>

            <div className="mt-8 space-y-8">
              {dictionary.privacy.sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-bold text-navy">{section.title}</h2>
                  <p className="mt-2 leading-relaxed text-slate">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
