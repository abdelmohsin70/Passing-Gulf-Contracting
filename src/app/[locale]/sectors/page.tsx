import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSectors } from "@/payload/queries/sectors";
import { getSolutions } from "@/payload/queries/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectorIcon } from "@/components/sections/SectorIcon";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { HeroSlider } from "@/components/sections/HeroSlider";
import { Reveal } from "@/components/Reveal";

// Rendered on demand — pulls Sectors/Solutions from Payload, so CMS edits
// take effect immediately without a redeploy.
export const dynamic = "force-dynamic";

const HERO_IMAGES = [
  "/images/facility-management-banner.jpg",
  "/images/airport-services-hero.jpg",
  "/images/arabic-hospitality.jpg",
  "/images/safety-helmets.jpg",
];

// Sectors have no image field in the CMS yet, so each card falls back to
// the client's real photo that best matches the sector's environment.
const SECTOR_IMAGES: Record<string, string> = {
  government: "/images/facility-management-banner.jpg",
  "airports-transport": "/images/airport-services-hero.jpg",
  education: "/images/cleaning-supplies.jpg",
  "industrial-logistics": "/images/workforce-driver.jpg",
  "residential-hospitality": "/images/arabic-hospitality.jpg",
  healthcare: "/images/cleaning-soft-services-banner.jpg",
  "commercial-admin": "/images/hero-technician.jpg",
};
const SECTOR_IMAGE_FALLBACK = "/images/technician-toolbox.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.sectorsIndex.title,
    description: dictionary.sectorsIndex.subtitle,
    alternates: { canonical: `/${locale}/sectors` },
  };
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;
  const [sectors, solutions] = await Promise.all([getSectors(), getSolutions()]);

  return (
    <>
      <HeroSlider images={HERO_IMAGES}>
        <Container className="py-4">
          <Breadcrumbs tone="dark" items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.sectorsIndex.title }]} />
          <div className="max-w-2xl pb-16 pt-6 sm:pb-20">
            <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">{dictionary.sectorsIndex.title}</h1>
            <p className="animate-fade-up mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{dictionary.sectorsIndex.subtitle}</p>
          </div>
        </Container>
      </HeroSlider>

      <Section tone="white">
        <Container>
          <div className="space-y-6">
            {sectors.map((sector, index) => {
              const relevant = solutions.filter((solution) => sector.relevantSolutions.includes(solution.slug));
              const image = SECTOR_IMAGES[sector.slug] ?? SECTOR_IMAGE_FALLBACK;
              return (
                <Reveal
                  key={sector.slug}
                  id={sector.slug}
                  delay={Math.min(index, 4) * 60}
                  className="scroll-mt-24 overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-soft transition-shadow hover:shadow-lift"
                >
                  <div className="flex flex-col sm:flex-row">
                    <div className="group relative h-44 w-full shrink-0 overflow-hidden sm:h-auto sm:w-64">
                      <Image
                        src={image}
                        alt=""
                        fill
                        sizes="(min-width: 640px) 16rem, 100vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
                      <span className="absolute bottom-3 start-3 flex size-11 items-center justify-center rounded-xl bg-navy/90 text-white shadow-soft">
                        <SectorIcon icon={sector.icon} className="size-6" />
                      </span>
                    </div>
                    <div className="flex-1 p-6 sm:p-8">
                      <h2 className="text-xl font-bold text-navy">{sector.title[locale]}</h2>
                      <p className="mt-2 leading-relaxed text-slate">{sector.description[locale]}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {relevant.map((solution) => (
                          <Link
                            key={solution.slug}
                            href={`${base}/solutions/${solution.slug}`}
                            className="focus-ring inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-navy/15 px-3 py-1.5 text-xs font-semibold text-navy hover:border-orange hover:text-orange"
                          >
                            <SolutionIcon icon={solution.icon} className="size-3.5" />
                            {solution.title[locale]}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>
    </>
  );
}
