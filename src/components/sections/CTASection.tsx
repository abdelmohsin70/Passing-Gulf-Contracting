import type { ReactNode } from "react";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";

export function CTASection({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  secondary,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondary?: ReactNode;
}) {
  return (
    <section className="bg-orange">
      <Container className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
        <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{title}</h2>
        <p className="max-w-xl text-base text-white/90 sm:text-lg">{subtitle}</p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button href={ctaHref} variant="secondary" size="lg">
            {ctaLabel}
          </Button>
          {secondary}
        </div>
      </Container>
    </section>
  );
}
