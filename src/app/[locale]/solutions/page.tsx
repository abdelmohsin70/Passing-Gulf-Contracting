import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSolutions } from "@/payload/queries/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { ChevronIcon } from "@/components/icons/icons";
import { Reveal } from "@/components/Reveal";

// Rendered on demand — pulls Solutions from Payload, so CMS edits take
// effect immediately without a redeploy.
export const dynamic = "force-dynamic";

const HERO_IMAGES = [
  "/images/hero-technician.jpg",
  "/images/pest-control-hero.jpg",
  "/images/landscape-agriculture-hero.jpg",
  "/images/renovation-projects-banner.jpg",
];

// If a solution has no hero image in the CMS yet, fall back to the
// client's real photo for that service so every card stays visual.
const CARD_IMAGE_FALLBACKS: Record<string, string> = {
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
  const solutions = await getSolutions();

  return (
    <>
      <HeroSlider images={HERO_IMAGES}>
        <Container className="py-4">
          <Breadcrumbs tone="dark" items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.solutionsIndex.title }]} />
          <div className="max-w-2xl pb-16 pt-6 sm:pb-20">
            <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">{dictionary.solutionsIndex.title}</h1>
            <p className="animate-fade-up mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{dictionary.solutionsIndex.subtitle}</p>
          </div>
        </Container>
      </HeroSlider>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution, index) => {
              const cardImage = solution.heroImage ?? CARD_IMAGE_FALLBACKS[solution.slug];
              return (
              <Reveal key={solution.slug} delay={(index % 3) * 90}>
                <Link
                  href={`${base}/solutions/${solution.slug}`}
                  className="focus-ring group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  {cardImage ? (
                    <div className="relative h-44 w-full overflow-hidden">
                      <Image
                        src={cardImage}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
                      <span className="absolute bottom-3 start-3 flex size-10 items-center justify-center rounded-xl bg-orange text-white shadow-soft">
                        <SolutionIcon icon={solution.icon} className="size-5" />
                      </span>
                    </div>
                  ) : (
                    <span className="m-6 flex size-12 items-center justify-center rounded-2xl bg-orange/10 text-orange">
                      <SolutionIcon icon={solution.icon} className="size-6" />
                    </span>
                  )}
                  <div className="flex flex-1 flex-col p-6 pt-5 sm:p-7 sm:pt-5">
                    <h2 className="text-lg font-bold text-navy">{solution.title[locale]}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{solution.summary[locale]}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
                      {dictionary.common.learnMore}
                      <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
