import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSectorBySlug } from "@/payload/queries/sectors";
import { getSolutions } from "@/payload/queries/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectorIcon } from "@/components/sections/SectorIcon";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/primitives/Button";
import { CheckIcon, ChevronIcon } from "@/components/icons/icons";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { ViewTracker } from "@/components/ViewTracker";
import { Reveal } from "@/components/Reveal";

// Rendered on demand from Payload so CMS edits appear without a redeploy.
export const dynamic = "force-dynamic";

// Sectors carry no image field wired to the frontend yet, so each hero
// falls back to the client's real photo that best fits the environment.
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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const sector = await getSectorBySlug(slug);
  if (!sector) return {};

  return {
    title: sector.title[locale],
    description: sector.description[locale],
    alternates: { canonical: `/${locale}/sectors/${slug}` },
  };
}

export default async function SectorPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const sector = await getSectorBySlug(slug);

  if (!sector) {
    notFound();
  }

  const solutions = await getSolutions();
  const base = `/${locale}`;
  const relevant = solutions.filter((solution) => sector.relevantSolutions.includes(solution.slug));
  const image = SECTOR_IMAGES[sector.slug] ?? SECTOR_IMAGE_FALLBACK;

  const breadcrumbSchema = breadcrumbJsonLd([
    { label: dictionary.common.breadcrumbHome, href: base },
    { label: dictionary.sectorsIndex.title, href: `${base}/sectors` },
    { label: sector.title[locale], href: `${base}/sectors/${slug}` },
  ]);
  const faqSchema =
    sector.faqs.length > 0
      ? faqJsonLd(sector.faqs.map((item) => ({ question: item.question[locale], answer: item.answer[locale] })))
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      ) : null}
      <ViewTracker event="sector_view" params={{ slug: sector.slug }} />

      <div className="relative overflow-hidden bg-navy pt-4 text-white">
        <Image src={image} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <Container className="relative">
          <Breadcrumbs
            tone="dark"
            items={[
              { label: dictionary.common.breadcrumbHome, href: base },
              { label: dictionary.sectorsIndex.title, href: `${base}/sectors` },
              { label: sector.title[locale] },
            ]}
          />
          <div className="flex max-w-3xl flex-col gap-5 pb-20 pt-6 sm:pb-24">
            <span className="animate-fade-up flex size-14 items-center justify-center rounded-2xl bg-white/10 text-orange">
              <SectorIcon icon={sector.icon} className="size-7" />
            </span>
            <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">{sector.title[locale]}</h1>
            <p className="animate-fade-up text-lg text-white/85">{sector.description[locale]}</p>
            <div className="animate-fade-up">
              <Button href={`${base}/contact?sector=${sector.slug}`} size="lg">
                {dictionary.home.finalCtaButton}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.6fr_1fr]">
            <div className="space-y-12">
              <Reveal>
                <p className="text-lg leading-relaxed text-slate">
                  {sector.operatingModel ? sector.operatingModel[locale] : dictionary.sectorsIndex.intro}
                </p>
              </Reveal>

              {sector.challenges.length > 0 ? (
                <Reveal>
                  <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.sectorsIndex.challengesTitle}</h2>
                  <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {sector.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2.5 rounded-[var(--radius-card)] border border-navy/10 bg-sand p-4 text-sm text-navy">
                        <CheckIcon className="mt-0.5 size-4 shrink-0 text-orange" />
                        {challenge[locale]}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}

              {sector.operatingModel ? (
                <Reveal>
                  <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.sectorsIndex.operatingModelTitle}</h2>
                  <p className="mt-4 leading-relaxed text-slate">{sector.operatingModel[locale]}</p>
                </Reveal>
              ) : null}

              <Reveal>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.sectorsIndex.solutionsTitle}</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {relevant.map((solution) => (
                    <Link
                      key={solution.slug}
                      href={`${base}/solutions/${solution.slug}`}
                      className="focus-ring group flex items-start gap-3 rounded-[var(--radius-card)] border border-navy/10 bg-white p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-orange/10 text-orange">
                        <SolutionIcon icon={solution.icon} className="size-5" />
                      </span>
                      <span className="flex-1">
                        <span className="block font-bold text-navy">{solution.title[locale]}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-slate">{solution.summary[locale]}</span>
                        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange">
                          {dictionary.common.learnMore}
                          <ChevronIcon className="size-3.5 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </Reveal>

              {sector.faqs.length > 0 ? (
                <div>
                  <h2 className="mb-4 text-xl font-bold text-navy sm:text-2xl">{dictionary.common.readFaq}</h2>
                  <FAQAccordion items={sector.faqs} locale={locale} />
                </div>
              ) : null}
            </div>

            <aside className="space-y-6">
              <Reveal variant="scale" className="overflow-hidden rounded-[var(--radius-card)] border border-navy/10 shadow-soft">
                <div className="relative aspect-[4/3]">
                  <Image src={image} alt="" fill sizes="(min-width: 1024px) 24vw, 90vw" className="object-cover" />
                </div>
              </Reveal>
              <Reveal variant="scale" delay={100} className="rounded-[var(--radius-card)] border border-navy/10 bg-navy p-6 text-white">
                <h3 className="text-lg font-bold">{dictionary.home.finalCtaTitle}</h3>
                <p className="mt-2 text-sm text-white/75">{dictionary.home.finalCtaSubtitle}</p>
                <div className="mt-5">
                  <Button href={`${base}/contact?sector=${sector.slug}`}>{dictionary.home.finalCtaButton}</Button>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </Section>

      <CTASection
        title={dictionary.home.finalCtaTitle}
        subtitle={dictionary.home.finalCtaSubtitle}
        ctaLabel={dictionary.home.finalCtaButton}
        ctaHref={`${base}/contact?sector=${sector.slug}`}
      />
    </>
  );
}
