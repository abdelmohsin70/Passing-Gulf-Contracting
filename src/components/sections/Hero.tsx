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

      <Container className="relative py-20 sm:py-28 lg:py-32">
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
      </Container>
    </section>
  );
}
