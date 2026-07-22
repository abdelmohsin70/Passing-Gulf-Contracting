import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";

export function Hero({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const base = `/${locale}`;

  return (
    <section className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -end-32 -top-32 size-96 rounded-full bg-orange/20 blur-3xl"
      />

      <Container className="relative grid grid-cols-1 items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div className="max-w-3xl animate-fade-up">
          <span className="inline-block rounded-[var(--radius-pill)] bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/90 sm:text-sm">
            {dictionary.trust.since}
          </span>
          <h1 className="mt-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            {dictionary.home.heroTitle}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            {dictionary.home.heroSubtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={`${base}/contact`} size="lg">
              {dictionary.home.heroCtaPrimary}
            </Button>
            <Button href={`${base}/solutions`} variant="outline-inverse" size="lg">
              {dictionary.home.heroCtaSecondary}
            </Button>
          </div>
        </div>

        <div className="relative order-first mx-auto w-full max-w-sm animate-fade-up lg:order-last" style={{ animationDelay: "150ms" }}>
          <div className="absolute -inset-4 -z-10 rounded-[2rem] border border-white/10" aria-hidden />
          <div className="absolute -end-6 -bottom-6 -z-10 size-32 rounded-2xl bg-orange/25 blur-2xl" aria-hidden />
          <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-lift">
            <Image
              src="/images/hero-technician.jpg"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 32vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
          </div>
        </div>
      </Container>
    </section>
  );
}
