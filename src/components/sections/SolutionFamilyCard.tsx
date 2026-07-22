import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { SolutionFamily } from "@/data/solution-families";
import { getSolutionBySlug } from "@/data/solutions";
import { SolutionIcon } from "@/components/sections/SolutionIcon";
import { ChevronIcon } from "@/components/icons/icons";

export function SolutionFamilyCard({
  family,
  locale,
  learnMoreLabel,
}: {
  family: SolutionFamily;
  locale: Locale;
  learnMoreLabel: string;
}) {
  const primary = getSolutionBySlug(family.primarySlug);

  return (
    <Link
      href={`/${locale}/solutions/${family.primarySlug}`}
      className="focus-ring group flex flex-col rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8"
    >
      <span className="flex size-12 items-center justify-center rounded-2xl bg-orange/10 text-orange transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        {primary ? <SolutionIcon icon={primary.icon} className="size-6" /> : null}
      </span>
      <h3 className="mt-5 text-lg font-bold text-navy">{family.title[locale]}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate">{family.description[locale]}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
        {learnMoreLabel}
        <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
