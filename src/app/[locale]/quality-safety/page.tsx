import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getQualitySafetyPage } from "@/payload/queries/qualitySafetyPage";
import { getPublicCertifications } from "@/payload/queries/certifications";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/primitives/Badge";
import { CTASection } from "@/components/sections/CTASection";
import { ShieldCheckIcon } from "@/components/icons/icons";
import { Reveal } from "@/components/Reveal";

// Rendered on demand — pulls Quality & Safety content and certifications
// from Payload, so CMS edits take effect immediately without a redeploy.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const page = await getQualitySafetyPage();

  return {
    title: page.title[locale],
    description: page.subtitle[locale],
    alternates: { canonical: `/${locale}/quality-safety` },
  };
}

export default async function QualitySafetyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;
  const [page, certifications] = await Promise.all([getQualitySafetyPage(), getPublicCertifications()]);

  return (
    <>
      <div className="relative overflow-hidden bg-navy text-white">
        {page.heroImage ? (
          <Image src={page.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <Container className="relative py-4">
          <Breadcrumbs tone="dark" items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: page.title[locale] }]} />
          <div className="max-w-2xl pb-16 pt-6 sm:pb-20">
            <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">{page.title[locale]}</h1>
            <p className="animate-fade-up mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{page.subtitle[locale]}</p>
          </div>
        </Container>
      </div>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {page.commitments.map((item, index) => (
              <Reveal
                key={item.title[locale]}
                delay={index * 90}
                className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ShieldCheckIcon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold text-navy">{item.title[locale]}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.body[locale]}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <Reveal className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">{page.certificationsSection.title[locale]}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {certifications.map((cert) => (
                <div key={cert.code} className="rounded-xl border border-navy/10 p-5 transition-shadow hover:shadow-soft">
                  <p className="font-mono text-sm font-bold text-navy" dir="ltr">
                    {cert.code}
                  </p>
                  <p className="mt-1 text-sm text-slate">{cert.label[locale]}</p>
                  {!cert.verified ? (
                    <Badge tone="pending" className="mt-3">
                      {dictionary.common.pendingVerification}
                    </Badge>
                  ) : null}
                </div>
              ))}
            </div>
            {page.certificationsSection.note ? (
              <p className="mt-6 text-sm leading-relaxed text-slate">{page.certificationsSection.note[locale]}</p>
            ) : null}
          </Reveal>
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
