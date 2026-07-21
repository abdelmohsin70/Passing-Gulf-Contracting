import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { caseStudies, getCaseStudyBySlug } from "@/data/projects";
import { sectors } from "@/data/sectors";
import { getSolutionBySlug } from "@/data/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/primitives/Badge";
import { CTASection } from "@/components/sections/CTASection";
import { ViewTracker } from "@/components/ViewTracker";

export function generateStaticParams() {
  return locales.flatMap((locale) => caseStudies.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) return {};

  return {
    title: caseStudy.clientLabel[locale],
    robots: caseStudy.isPlaceholder ? { index: false, follow: true } : undefined,
    alternates: { canonical: `/${locale}/projects/${slug}` },
  };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const caseStudy = getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const base = `/${locale}`;
  const sector = sectors.find((item) => item.slug === caseStudy.sectorSlug);
  const solution = getSolutionBySlug(caseStudy.solutionSlug);

  return (
    <>
      <ViewTracker event="case_study_view" params={{ slug: caseStudy.slug }} />
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs
            items={[
              { label: dictionary.common.breadcrumbHome, href: base },
              { label: dictionary.projectsIndex.title, href: `${base}/projects` },
              { label: caseStudy.clientLabel[locale] },
            ]}
          />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          {caseStudy.isPlaceholder ? (
            <Badge tone="pending" className="mb-4">
              {dictionary.caseStudy.placeholderBadge}
            </Badge>
          ) : null}
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{caseStudy.clientLabel[locale]}</h1>
          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
            <div>
              <dt className="font-semibold text-slate">{dictionary.caseStudy.city}</dt>
              <dd className="mt-1 text-navy">{caseStudy.city[locale]}</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate">{dictionary.caseStudy.sector}</dt>
              <dd className="mt-1 text-navy">{sector?.title[locale]}</dd>
            </div>
            <div className="col-span-2 sm:col-span-2">
              <dt className="font-semibold text-slate">{dictionary.caseStudy.solution}</dt>
              <dd className="mt-1 text-navy">{solution?.title[locale]}</dd>
            </div>
          </dl>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="text-lg font-bold text-navy">{dictionary.caseStudy.scope}</h2>
              <p className="mt-3 leading-relaxed text-slate">{caseStudy.scope[locale]}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy">{dictionary.caseStudy.challenge}</h2>
              <p className="mt-3 leading-relaxed text-slate">{caseStudy.challenge[locale]}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy">{dictionary.caseStudy.approach}</h2>
              <p className="mt-3 leading-relaxed text-slate">{caseStudy.approach[locale]}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-navy">{dictionary.caseStudy.result}</h2>
              <p className="mt-3 leading-relaxed text-slate">{caseStudy.result[locale]}</p>
            </div>
          </div>
        </Container>
      </Section>

      <CTASection
        title={dictionary.home.finalCtaTitle}
        subtitle={dictionary.home.finalCtaSubtitle}
        ctaLabel={dictionary.home.finalCtaButton}
        ctaHref={`${base}/contact`}
      />
    </>
  );
}
