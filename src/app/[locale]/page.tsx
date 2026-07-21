import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { solutionFamilies } from "@/data/solution-families";
import { sectors } from "@/data/sectors";
import { caseStudies } from "@/data/projects";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { SectionHeading } from "@/components/primitives/Heading";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { SolutionFamilyCard } from "@/components/sections/SolutionFamilyCard";
import { SectorCard } from "@/components/sections/SectorCard";
import { OutcomeGrid } from "@/components/sections/OutcomeGrid";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { ClientLogoGrid } from "@/components/sections/ClientLogoGrid";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/primitives/Button";
import { HomeIcon } from "@/components/icons/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.home.heroTitle,
    description: dictionary.home.heroSubtitle,
    alternates: { canonical: `/${locale}` },
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Hero locale={locale} dictionary={dictionary} />
      <TrustStrip dictionary={dictionary} />

      <Section tone="sand">
        <Container>
          <SectionHeading
            eyebrow={dictionary.trust.integrated}
            title={dictionary.home.partnerTitle}
            subtitle={dictionary.home.partnerSubtitle}
          />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutionFamilies.map((family) => (
              <SolutionFamilyCard key={family.id} family={family} locale={locale} learnMoreLabel={dictionary.common.learnMore} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button href={`${base}/solutions`} variant="outline">
              {dictionary.common.viewAllSolutions}
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading title={dictionary.home.sectorsTitle} subtitle={dictionary.home.sectorsSubtitle} />
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector) => (
              <SectorCard key={sector.slug} sector={sector} locale={locale} href={`${base}/sectors#${sector.slug}`} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeading title={dictionary.home.outcomesTitle} subtitle={dictionary.home.outcomesSubtitle} />
          <div className="mt-10">
            <OutcomeGrid locale={locale} />
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading title={dictionary.home.processTitle} subtitle={dictionary.home.processSubtitle} />
          <div className="mt-10">
            <ProcessTimeline locale={locale} />
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <SectionHeading title={dictionary.home.caseStudyTitle} subtitle={dictionary.home.caseStudySubtitle} />
          <p className="mt-4 max-w-2xl text-sm text-slate">{dictionary.home.caseStudyPendingNote}</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} locale={locale} dictionary={dictionary} />
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <SectionHeading align="center" title={dictionary.home.clientsTitle} />
          <div className="mt-10">
            <ClientLogoGrid dictionary={dictionary} />
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-[var(--radius-card)] border border-navy/10 bg-white p-8 text-center shadow-soft sm:p-12">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              <HomeIcon className="size-7" />
            </span>
            <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.home.homeCareBannerTitle}</h2>
            <p className="max-w-xl text-sm text-slate sm:text-base">{dictionary.home.homeCareBannerSubtitle}</p>
            <Link
              href={`${base}/solutions/home-care`}
              className="focus-ring rounded-[var(--radius-pill)] border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy hover:border-orange hover:text-orange"
            >
              {dictionary.home.homeCareBannerCta}
            </Link>
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
