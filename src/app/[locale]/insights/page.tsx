import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getPublishedInsights } from "@/payload/queries/insights";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/primitives/Badge";
import { ChevronIcon } from "@/components/icons/icons";
import { Reveal } from "@/components/Reveal";

// Rendered on demand — published articles appear without a redeploy.
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
    title: dictionary.insightsIndex.title,
    description: dictionary.insightsIndex.subtitle,
    alternates: { canonical: `/${locale}/insights` },
  };
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;
  const insights = await getPublishedInsights();

  return (
    <>
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.insightsIndex.title }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.insightsIndex.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{dictionary.insightsIndex.subtitle}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          {insights.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-navy/15 bg-white py-16 text-center">
              <Badge tone="pending">{dictionary.insightsIndex.emptyState}</Badge>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((insight, index) => (
                <Reveal key={insight.slug} delay={(index % 3) * 90}>
                  <Link
                    href={`${base}/insights/${insight.slug}`}
                    className="focus-ring group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    {insight.cover ? (
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={insight.cover}
                          alt=""
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate">
                        {insight.category ? (
                          <span className="rounded-[var(--radius-pill)] bg-orange/10 px-2.5 py-1 font-semibold text-orange-dark">
                            {dictionary.insightsIndex.categories[insight.category]}
                          </span>
                        ) : null}
                        {insight.readingTimeMinutes ? (
                          <span>
                            {insight.readingTimeMinutes} {dictionary.insightsIndex.readingTime}
                          </span>
                        ) : null}
                      </div>
                      <h2 className="mt-3 text-lg font-bold text-navy">{insight.title[locale]}</h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{insight.excerpt[locale]}</p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
                        {dictionary.common.learnMore}
                        <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
