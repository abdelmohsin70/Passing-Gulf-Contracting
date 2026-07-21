import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { solutions } from "@/data/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { ChevronIcon } from "@/components/icons/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.solutionsIndex.title,
    description: dictionary.solutionsIndex.subtitle,
    alternates: { canonical: `/${locale}/solutions` },
  };
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.solutionsIndex.title }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.solutionsIndex.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{dictionary.solutionsIndex.subtitle}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution) => (
              <Link
                key={solution.slug}
                href={`${base}/solutions/${solution.slug}`}
                className="focus-ring group flex flex-col rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-7"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-orange/10 text-orange">
                  <SolutionIcon icon={solution.icon} className="size-6" />
                </span>
                <h2 className="mt-5 text-lg font-bold text-navy">{solution.title[locale]}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{solution.summary[locale]}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
                  {dictionary.common.learnMore}
                  <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
