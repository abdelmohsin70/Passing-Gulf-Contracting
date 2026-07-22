import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { company } from "@/config/company";
import { getAboutPage } from "@/payload/queries/aboutPage";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CTASection } from "@/components/sections/CTASection";
import { CheckIcon } from "@/components/icons/icons";
import { Reveal } from "@/components/Reveal";

// Rendered on demand — pulls the About Us content from Payload, so CMS
// edits take effect immediately without a redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const about = await getAboutPage();

  return {
    title: about.title[locale],
    description: about.subtitle[locale],
    alternates: { canonical: `/${locale}/about` },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const about = await getAboutPage();
  const base = `/${locale}`;

  return (
    <>
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: about.title[locale] }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{about.title[locale]}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{about.subtitle[locale]}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
            <div className="space-y-12">
              <Reveal className="grid grid-cols-1 gap-6 sm:grid-cols-[1fr_auto] sm:items-start">
                <div>
                  <h2 className="text-xl font-bold text-navy sm:text-2xl">{about.story.title[locale]}</h2>
                  <p className="mt-4 leading-relaxed text-slate">{about.story.body[locale]}</p>
                </div>
                {about.story.image ? (
                  <div className="relative h-40 w-full overflow-hidden rounded-[var(--radius-card)] shadow-soft sm:h-full sm:w-40">
                    <Image src={about.story.image} alt="" fill sizes="160px" className="object-cover transition-transform duration-500 hover:scale-110" />
                  </div>
                ) : null}
              </Reveal>

              <Reveal delay={80}>
                <h2 className="text-xl font-bold text-navy sm:text-2xl">{about.missionSection.sectionTitle[locale]}</h2>
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="rounded-[var(--radius-card)] bg-sand p-5 transition-shadow hover:shadow-soft">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-orange-dark">{about.missionSection.visionLabel[locale]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy">{about.missionSection.visionBody[locale]}</p>
                  </div>
                  <div className="rounded-[var(--radius-card)] bg-sand p-5 transition-shadow hover:shadow-soft">
                    <h3 className="text-sm font-bold uppercase tracking-wide text-orange-dark">{about.missionSection.missionLabel[locale]}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy">{about.missionSection.missionBody[locale]}</p>
                  </div>
                </div>
                {about.valuesLabel ? (
                  <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-slate">{about.valuesLabel[locale]}</h3>
                ) : null}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {about.values.map((value, index) => (
                    <Reveal key={value.title[locale]} delay={index * 80} className="rounded-[var(--radius-card)] border border-navy/10 p-4 transition-shadow hover:shadow-soft">
                      <h4 className="font-bold text-navy">{value.title[locale]}</h4>
                      <p className="mt-1.5 text-sm text-slate">{value.body[locale]}</p>
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </div>

            <aside className="space-y-6">
              {about.sideImage ? (
                <Reveal variant="scale" className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] shadow-soft">
                  <Image src={about.sideImage} alt="" fill sizes="(min-width: 1024px) 24vw, 90vw" className="object-cover" />
                </Reveal>
              ) : null}
              <Reveal variant="scale" delay={100} className="rounded-[var(--radius-card)] border border-navy/10 bg-navy p-6 text-white sm:p-8">
                <h3 className="text-lg font-bold">{about.whyTitle[locale]}</h3>
                <ul className="mt-5 space-y-3.5">
                  {about.why.map((item) => (
                    <li key={item.item[locale]} className="flex items-start gap-2.5 text-sm text-white/85">
                      <CheckIcon className="mt-0.5 size-4 shrink-0 text-orange" />
                      {item.item[locale]}
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
