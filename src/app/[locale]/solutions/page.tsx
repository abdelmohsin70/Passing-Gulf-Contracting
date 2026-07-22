import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { solutions } from "@/data/solutions";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { ChevronIcon } from "@/components/icons/icons";
import { Reveal } from "@/components/Reveal";

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

  return (
    <>
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.solutionsIndex.title }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.solutionsIndex.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{dictionary.solutionsIndex.subtitle}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {solutions.map((solution, index) => (
              <Reveal key={solution.slug} delay={(index % 3) * 90}>
                <Link
                  href={`${base}/solutions/${solution.slug}`}
                  className="focus-ring group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  {solution.heroImage ? (
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={solution.heroImage}
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
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
