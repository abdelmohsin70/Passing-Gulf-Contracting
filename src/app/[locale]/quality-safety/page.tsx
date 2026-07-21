import type { Metadata } from "next";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { company } from "@/config/company";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/primitives/Badge";
import { CTASection } from "@/components/sections/CTASection";
import { ShieldCheckIcon } from "@/components/icons/icons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);

  return {
    title: dictionary.qualitySafety.title,
    description: dictionary.qualitySafety.subtitle,
    alternates: { canonical: `/${locale}/quality-safety` },
  };
}

export default async function QualitySafetyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: localeParam } = await params;
  const locale = (isLocale(localeParam) ? localeParam : "ar") as Locale;
  const dictionary = getDictionary(locale);
  const base = `/${locale}`;

  return (
    <>
      <Section tone="sand" className="py-0">
        <Container>
          <Breadcrumbs items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.qualitySafety.title }]} />
        </Container>
      </Section>

      <Section tone="sand" className="pt-4">
        <Container>
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{dictionary.qualitySafety.title}</h1>
          <p className="mt-3 max-w-2xl text-base text-slate sm:text-lg">{dictionary.qualitySafety.subtitle}</p>
        </Container>
      </Section>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dictionary.qualitySafety.commitments.map((item) => (
              <div key={item.title} className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft">
                <span className="flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ShieldCheckIcon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <div className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.qualitySafety.certificationsTitle}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {company.certifications.map((cert) => (
                <div key={cert.code} className="rounded-xl border border-navy/10 p-5">
                  <p className="font-mono text-sm font-bold text-navy" dir="ltr">
                    {cert.code}
                  </p>
                  <p className="mt-1 text-sm text-slate">{cert.label[locale]}</p>
                  <Badge tone="pending" className="mt-3">
                    {dictionary.common.pendingVerification}
                  </Badge>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-relaxed text-slate">{dictionary.qualitySafety.certificationsNote}</p>
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
