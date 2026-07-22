import type { Metadata } from "next";
import Image from "next/image";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { company } from "@/config/company";
import { Container } from "@/components/primitives/Container";
import { Section } from "@/components/primitives/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Badge } from "@/components/primitives/Badge";
import { CTASection } from "@/components/sections/CTASection";
import { ShieldCheckIcon } from "@/components/icons/icons";
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
      <div className="relative overflow-hidden bg-navy text-white">
        <Image src="/images/safety-helmets.jpg" alt="" fill priority sizes="100vw" className="object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/70" />
        <Container className="relative py-4">
          <Breadcrumbs tone="dark" items={[{ label: dictionary.common.breadcrumbHome, href: base }, { label: dictionary.qualitySafety.title }]} />
          <div className="max-w-2xl pb-16 pt-6 sm:pb-20">
            <h1 className="animate-fade-up text-3xl font-bold sm:text-4xl">{dictionary.qualitySafety.title}</h1>
            <p className="animate-fade-up mt-3 max-w-2xl text-base text-white/85 sm:text-lg">{dictionary.qualitySafety.subtitle}</p>
          </div>
        </Container>
      </div>

      <Section tone="white">
        <Container>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dictionary.qualitySafety.commitments.map((item, index) => (
              <Reveal
                key={item.title}
                delay={index * 90}
                className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ShieldCheckIcon className="size-5" />
                </span>
                <h3 className="mt-4 font-bold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="sand">
        <Container>
          <Reveal className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="text-xl font-bold text-navy sm:text-2xl">{dictionary.qualitySafety.certificationsTitle}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {company.certifications.map((cert) => (
                <div key={cert.code} className="rounded-xl border border-navy/10 p-5 transition-shadow hover:shadow-soft">
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
