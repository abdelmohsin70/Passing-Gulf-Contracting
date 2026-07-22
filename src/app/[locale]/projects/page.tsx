import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { company } from "@/config/company";
import { getHomepageCaseStudies } from "@/payload/queries/projects";
import { getSectors } from "@/payload/queries/sectors";
import { getSolutions } from "@/payload/queries/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CaseStudyCard } from "@/components/sections/CaseStudyCard";
import { CTASection } from "@/components/sections/CTASection";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { ChevronIcon } from "@/components/icons/icons";
import { Badge } from "@/components/primitives/Badge";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";

// Rendered on demand — pulls Projects/Sectors/Solutions from Payload, so
// CMS edits take effect immediately without a redeploy.
export const dynamic = "force-dynamic";

const HERO_IMAGES = [
  "/images/renovation-projects-banner.jpg",
  "/images/hvac-maintenance.jpg",
  "/images/plumbing-repair.jpg",
  "/images/technician-toolbox.jpg",
];

// Real work-site photos from the client's profile, keyed by solution slug,
// used for the showcase grid (and as a fallback if CMS media is missing).
const WORK_IMAGES: Record<string, string> = {
  "home-care": "/images/home-care-pool.jpg",
  "hospitality-workforce": "/images/arabic-hospitality.jpg",
  "pest-control": "/images/pest-control-hero.jpg",
  "airport-services": "/images/airport-services-hero.jpg",
  "landscape-agriculture": "/images/landscape-agriculture-hero.jpg",
  "renovation-projects": "/images/renovation-projects-banner.jpg",
  "cleaning-soft-services": "/images/cleaning-soft-services-banner.jpg",
  "facility-management": "/images/facility-management-banner.jpg",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.projectsIndex.title,
    description: dictionary.projectsIndex.subtitle,
    alternates: { canonical: `/${locale}/projects` },
  };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;
  const [caseStudies, sectors, solutions] = await Promise.all([getHomepageCaseStudies(), getSectors(), getSolutions()]);

  // Honest profile facts only — solution/sector counts come from the live
  // CMS data, never hard-coded claims.
  const stats: Array<{ value: string; label: string }> = [
    { value: String(company.foundedYear), label: dictionary.projectsIndex.statSinceLabel },
    { value: String(solutions.length), label: dictionary.projectsIndex.statSolutions },
    { value: String(sectors.length), label: dictionary.projectsIndex.statSectors },
    { value: "24/7", label: dictionary.projectsIndex.stat247 },
  ];

  return (
    <>
      <HeroSlider images={HERO_IMAGES}>
        <Container className="py-4">
          <Breadcrumbs tone="dark" items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.projectsIndex.title }]} />
          <div className="max-w-2xl pb-16 pt-6 sm:pb-20">
            <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">{dictionary.projectsIndex.title}</h1>
            <p className="animate-fade-up mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{dictionary.projectsIndex.subtitle}</p>
          </div>
        </Container>
      </HeroSlider>

      <Section tone="sand" className="py-10">
        <Container>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal
                key={stat.label}
                delay={index * 80}
                className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-5 text-center shadow-soft"
              >
                <CountUp value={stat.value} className="text-2xl font-bold text-orange sm:text-3xl" />
                <p className="mt-1.5 text-xs font-semibold text-navy sm:text-sm">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{dictionary.projectsIndex.showcaseTitle}</h2>
          <p className="mt-3 max-w-2xl text-slate">{dictionary.projectsIndex.showcaseSubtitle}</p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {solutions.map((solution, index) => {
              const image = solution.heroImage ?? WORK_IMAGES[solution.slug];
              if (!image) return null;
              return (
                <Reveal key={solution.slug} delay={(index % 4) * 80}>
                  <Link
                    href={`${base}/solutions/${solution.slug}`}
                    className="focus-ring group relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <span className="flex size-9 items-center justify-center rounded-lg bg-orange text-white shadow-soft">
                        <SolutionIcon icon={solution.icon} className="size-4.5" />
                      </span>
                      <h3 className="mt-3 font-bold text-white">{solution.title[locale]}</h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/75">{solution.heroOutcome[locale]}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-orange">
                        {dictionary.common.learnMore}
                        <ChevronIcon className="size-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">{dictionary.projectsIndex.caseStudiesTitle}</h2>
          <Badge tone="pending" className="mt-4">
            {dictionary.projectsIndex.pendingBanner}
          </Badge>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard key={caseStudy.slug} caseStudy={caseStudy} locale={locale} dictionary={dictionary} sectors={sectors} solutions={solutions} />
            ))}
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
