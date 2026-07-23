import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { solutionFamilies } from "@/data/solution-families";
import { getSectors } from "@/payload/queries/sectors";
import { getSolutions } from "@/payload/queries/solutions";
import { getHomepageCaseStudies } from "@/payload/queries/projects";
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
import { Reveal } from "@/components/Reveal";

// Rendered on demand rather than statically prerendered — pulls Solutions,
// Sectors, and Projects from Payload, so publishing/editing CMS content
// takes effect immediately without a redeploy.
export const dynamic = "force-dynamic";

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
  const [sectors, solutionsForCards, caseStudies] = await Promise.all([getSectors(), getSolutions(), getHomepageCaseStudies()]);

  return (
    <>
      <Hero locale={locale} dictionary={dictionary} />
      <TrustStrip dictionary={dictionary} />

      <Section tone="sand">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow={dictionary.trust.integrated}
              title={dictionary.home.partnerTitle}
              subtitle={dictionary.home.partnerSubtitle}
            />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutionFamilies.map((family, index) => (
              <Reveal key={family.id} delay={index * 90}>
                <SolutionFamilyCard family={family} locale={locale} learnMoreLabel={dictionary.common.learnMore} />
              </Reveal>
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
          <Reveal>
            <SectionHeading title={dictionary.home.sectorsTitle} subtitle={dictionary.home.sectorsSubtitle} />
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sectors.map((sector, index) => (
              <Reveal key={sector.slug} delay={(index % 3) * 90}>
                <SectorCard sector={sector} locale={locale} href={`${base}/sectors/${sector.slug}`} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <Reveal>
            <SectionHeading title={dictionary.home.outcomesTitle} subtitle={dictionary.home.outcomesSubtitle} />
          </Reveal>
          <div className="mt-10">
            <OutcomeGrid locale={locale} />
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Reveal>
            <SectionHeading title={dictionary.home.processTitle} subtitle={dictionary.home.processSubtitle} />
          </Reveal>
          <div className="mt-10">
            <ProcessTimeline locale={locale} />
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <Reveal>
            <SectionHeading title={dictionary.home.caseStudyTitle} subtitle={dictionary.home.caseStudySubtitle} />
          </Reveal>
          <p className="mt-4 max-w-2xl text-sm text-slate">{dictionary.home.caseStudyPendingNote}</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy, index) => (
              <Reveal key={caseStudy.slug} delay={index * 90}>
                <CaseStudyCard caseStudy={caseStudy} locale={locale} dictionary={dictionary} sectors={sectors} solutions={solutionsForCards} />
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <Reveal variant="fade">
            <SectionHeading align="center" title={dictionary.home.clientsTitle} />
          </Reveal>
          <div className="mt-10">
            <ClientLogoGrid dictionary={dictionary} />
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <Reveal variant="scale" className="flex flex-col items-center gap-6 rounded-[var(--radius-card)] border border-navy/10 bg-white p-8 text-center shadow-soft sm:p-12">
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
          </Reveal>
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
