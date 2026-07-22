import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { company } from "@/config/company";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";
import { CheckIcon } from "@/components/icons/icons";
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
    title: dictionary.about.title,
    description: dictionary.about.subtitle,
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.about.title }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.about.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{dictionary.about.subtitle}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-12">
              <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.about.storyTitle}</h2>
                  <p className="mt-4 leading-relaxed text-slate">{dictionary.about.storyBody}</p>
                </div>
                <div className="relative h-40 w-full overflow-hidden rounded-[var(--radius-card)] shadow-soft sm:h-full sm:w-40">
                  <Image src="/images/wrenches-hand.jpg" alt="" fill sizes="160px" className="object-cover transition-transform duration-500 hover:scale-110" />
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.about.missionTitle}</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-card)] bg-sand p-5 transition-shadow hover:shadow-soft">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-orange-dark">{dictionary.about.visionLabel}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy">{dictionary.about.visionBody}</p>
                  </div>
                  <div className="rounded-[var(--radius-card)] bg-sand p-5 transition-shadow hover:shadow-soft">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-orange-dark">{dictionary.about.missionLabel}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy">{dictionary.about.missionBody}</p>
                  </div>
                </div>
                <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-slate">{dictionary.about.valuesLabel}</h3>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {dictionary.about.values.map((value, index) => (
                    <Reveal key={value.title} delay={index * 80} className="rounded-[var(--radius-card)] border border-navy/10 p-4 transition-shadow hover:shadow-soft">
                      <h4 className="font-bold text-navy">{value.title}</h4>
                      <p className="mt-1.5 text-sm text-slate">{value.body}</p>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </div>

            <aside className="space-y-6">
              <Reveal variant="scale" className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] shadow-soft">
                <Image src="/images/technician-toolbox.jpg" alt="" fill sizes="(min-width: 1024px) 24vw, 90vw" className="object-cover" />
              </Reveal>
              <Reveal variant="scale" delay={100} className="rounded-[var(--radius-card)] border border-navy/10 bg-navy p-6 text-white sm:p-8">
                <h3 className="text-lg font-bold">{dictionary.about.whyTitle}</h3>
                <ul className="mt-5 space-y-3.5">
                  {dictionary.about.why.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-white/85">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-white/10 pt-5 text-xs text-white/60">
                  {company.foundedCity[locale]} &middot; {company.foundedYear}
                </p>
              </Reveal>
            </aside>
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
