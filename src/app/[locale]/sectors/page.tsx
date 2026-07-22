import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getSectors } from "@/payload/queries/sectors";
import { getSolutions } from "@/payload/queries/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SectorIcon } from "@/components/sections/SectorIcon";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { Reveal } from "@/components/Reveal";

// Rendered on demand — pulls Sectors/Solutions from Payload, so CMS edits
// take effect immediately without a redeploy.
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
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.sectorsIndex.title }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.sectorsIndex.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{dictionary.sectorsIndex.subtitle}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="space-y-6">
            {sectors.map((sector, index) => {
              const relevant = solutions.filter((solution) => sector.relevantSolutions.includes(solution.slug));
              return (
                <Reveal
                  key={sector.slug}
                  id={sector.slug}
                  delay={Math.min(index, 4) * 60}
                  className="scroll-mt-24 rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft transition-shadow hover:shadow-lift sm:p-8"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                    <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-navy text-white">
                      <SectorIcon icon={sector.icon} className="size-7" />
                    </span>
                    <div className="flex-1">
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
