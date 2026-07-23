import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getInsightBySlug } from "@/payload/queries/insights";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";
import { ChevronIcon } from "@/components/icons/icons";
import { breadcrumbJsonLd } from "@/lib/seo";
import { ViewTracker } from "@/components/ViewTracker";

// Rendered on demand from Payload.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const insight = await getInsightBySlug(slug);
  if (!insight) return {};

  return {
    title: insight.title[locale],
    description: insight.excerpt[locale],
    alternates: { canonical: `/${locale}/insights/${slug}` },
  };
}

export default async function InsightPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const insight = await getInsightBySlug(slug);

  if (!insight) {
    notFound();
  }

  const base = `/${locale}`;
  const body = insight.body[locale] ?? insight.body.ar;
  const breadcrumbSchema = breadcrumbJsonLd([
    { label: dictionary.common.breadcrumbHome, href: base },
    { label: dictionary.insightsIndex.title, href: `${base}/insights` },
    { label: insight.title[locale], href: `${base}/insights/${slug}` },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ViewTracker event="insight_view" params={{ slug: insight.slug }} />

      {insight.cover ? (
        <div className="relative overflow-hidden bg-navy text-white">
          <Image src={insight.cover} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/65" />
          <Container className="relative py-4">
            <Breadcrumbs
              tone="dark"
              items={[
                { label: dictionary.common.breadcrumbHome, href: base },
                { label: dictionary.insightsIndex.title, href: `${base}/insights` },
                { label: insight.title[locale] },
              ]}
            />
            <div className="max-w-3xl pb-14 pt-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-white/70">
                {insight.category ? (
                  <span className="rounded-[var(--radius-pill)] bg-orange px-2.5 py-1 font-semibold text-white">
                    {dictionary.insightsIndex.categories[insight.category]}
                  </span>
                ) : null}
                {insight.readingTimeMinutes ? (
                  <span>
                    {insight.readingTimeMinutes} {dictionary.insightsIndex.readingTime}
                  </span>
                ) : null}
              </div>
              <h1 className="animate-fade-up mt-4 text-3xl font-bold sm:text-4xl">{insight.title[locale]}</h1>
              <p className="animate-fade-up mt-3 text-lg text-white/85">{insight.excerpt[locale]}</p>
            </div>
          </Container>
        </div>
      ) : (
        <>
          <Section tone="sand" className="py-0">
            <Container>
              <Breadcrumbs
                items={[
                  { label: dictionary.common.breadcrumbHome, href: base },
                  { label: dictionary.insightsIndex.title, href: `${base}/insights` },
                  { label: insight.title[locale] },
                ]}
              />
            </Container>
          </Section>
          <Section tone="sand" className="pt-4">
            <Container>
              <h1 className="text-3xl font-bold text-navy sm:text-4xl">{insight.title[locale]}</h1>
              <p className="mt-3 max-w-2xl text-lg text-slate">{insight.excerpt[locale]}</p>
            </Container>
          </Section>
        </>
      )}

      <Section tone="white">
        <Container>
          <article className="prose-insight mx-auto max-w-3xl">
            {body ? <RichText data={body} /> : null}
          </article>
          <div className="mx-auto mt-10 max-w-3xl">
            <Link href={`${base}/insights`} className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
              <ChevronIcon className="size-4 rotate-180 rtl:rotate-0" />
              {dictionary.insightsIndex.backToInsights}
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
