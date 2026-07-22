import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { solutions, getSolutionBySlug } from "@/data/solutions";
import { sectors } from "@/data/sectors";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { FAQAccordion } from "@/components/sections/FAQAccordion";
import { SiteGallery } from "@/components/sections/SiteGallery";
import { CTASection } from "@/components/sections/CTASection";
import { Button } from "@/components/primitives/Button";
import { CheckIcon } from "@/components/icons/icons";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { ViewTracker } from "@/components/ViewTracker";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return locales.flatMap((locale) => solutions.map((solution) => ({ locale, slug: solution.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};

  return {
    title: solution.title[locale],
    description: solution.summary[locale],
    alternates: { canonical: `/${locale}/solutions/${slug}` },
  };
}

export default async function SolutionPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const solution = getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  const base = `/${locale}`;
  const relevantSectors = sectors.filter((sector) => solution.sectors.includes(sector.slug));
  const relatedSolutions = solutions.filter((item) => solution.sectors.some((s) => item.sectors.includes(s)) && item.slug !== solution.slug).slice(0, 3);

  const faqSchema = faqJsonLd(
    solution.faqs.map((item) => ({ question: item.question[locale], answer: item.answer[locale] }))
  );
  const serviceSchema = serviceJsonLd({ name: solution.title[locale], description: solution.summary[locale], locale, slug });
  const breadcrumbSchema = breadcrumbJsonLd([
    { label: dictionary.common.breadcrumbHome, href: base },
    { label: dictionary.solutionsIndex.title, href: `${base}/solutions` },
    { label: solution.title[locale], href: `${base}/solutions/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ViewTracker event="service_view" params={{ slug: solution.slug }} />

      <div className="relative overflow-hidden bg-navy pt-4 text-white">
        {solution.heroImage ? (
          <>
            <Image
              src={solution.heroImage}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
          </>
        ) : null}
        <Container className="relative">
          <Breadcrumbs
            tone="dark"
            items={[
              { label: dictionary.common.breadcrumbHome, href: base },
              { label: dictionary.solutionsIndex.title, href: `${base}/solutions` },
              { label: solution.title[locale] },
            ]}
          />
          <div className="flex max-w-3xl flex-col gap-5 pb-20 pt-6 sm:pb-24">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/10 text-orange animate-fade-up">
              <SolutionIcon icon={solution.icon} className="size-7" />
            </span>
            <h1 className="text-3xl font-bold sm:text-4xl animate-fade-up">{solution.title[locale]}</h1>
            <p className="text-lg text-white/85 animate-fade-up">{solution.heroOutcome[locale]}</p>
            <div className="animate-fade-up">
              <Button href={`${base}/contact?service=${solution.slug}`} size="lg">
                {dictionary.common.requestTechnicalVisit}
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
                <h2 className="text-xl font-bold text-navy sm:text-2xl">
                  {locale === "ar" ? "المشكلة التي نحلها" : "The Problem We Solve"}
                </h2>
                <p className="mt-4 leading-relaxed text-slate">{solution.problem[locale]}</p>
              </Reveal>

              <Reveal>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.common.scopeOfWork}</h2>
                <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {solution.scope.map((item, index) => (
                    <li key={index} className="flex items-start gap-2.5 text-sm text-navy">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-success" />
                      {item[locale]}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.common.methodology}</h2>
                <p className="mt-4 leading-relaxed text-slate">{solution.methodology[locale]}</p>
              </Reveal>

              <Reveal>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.common.qualityAndSafety}</h2>
                <p className="mt-4 leading-relaxed text-slate">{solution.quality[locale]}</p>
              </Reveal>

              <div>
                <h2 className="mb-4 text-xl font-bold text-navy sm:text-2xl">
                  {locale === "ar" ? "لمحة من مواقع العمل" : "A Look at Our Sites"}
                </h2>
                <SiteGallery
                  images={solution.gallery}
                  icon={solution.icon}
                  placeholderLabel={locale === "ar" ? "صور حقيقية قريبًا" : "Real photography coming soon"}
                />
              </div>

              <div>
                <h2 className="mb-4 text-xl font-bold text-navy sm:text-2xl">{dictionary.common.readFaq}</h2>
                <FAQAccordion items={solution.faqs} locale={locale} />
              </div>
            </div>

            <aside className="space-y-6">
              <Reveal variant="scale" className="rounded-[var(--radius-card)] border border-navy/10 bg-sand p-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate">{dictionary.common.relevantSectors}</h3>
                <ul className="mt-4 space-y-2.5">
                  {relevantSectors.map((sector) => (
                    <li key={sector.slug}>
                      <a href={`${base}/sectors#${sector.slug}`} className="focus-ring text-sm font-medium text-navy hover:text-orange">
                        {sector.title[locale]}
                      </a>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {relatedSolutions.length ? (
                <Reveal variant="scale" delay={100} className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-slate">{dictionary.common.relatedSolutions}</h3>
                  <ul className="mt-4 space-y-3">
                    {relatedSolutions.map((item) => (
                      <li key={item.slug}>
                        <a href={`${base}/solutions/${item.slug}`} className="focus-ring flex items-center gap-2.5 text-sm font-medium text-navy hover:text-orange">
                          <SolutionIcon icon={item.icon} className="size-4 text-orange" />
                          {item.title[locale]}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>

      <CTASection
        title={
          locale === "ar"
            ? `مستعد تبدأ مع "${solution.title[locale]}"؟`
            : `Ready to get started with ${solution.title[locale]}?`
        }
        subtitle={dictionary.home.finalCtaSubtitle}
        ctaLabel={dictionary.common.requestTechnicalVisit}
        ctaHref={`${base}/contact?service=${solution.slug}`}
      />
    </>
  );
}
