import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CaseStudy } from "@/data/projects";
import { sectors } from "@/data/sectors";
import { solutions } from "@/data/solutions";
import { Badge } from "@/components/primitives/Badge";
import { ChevronIcon } from "@/components/icons/icons";

export function CaseStudyCard({
  caseStudy,
  locale,
  dictionary,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
  dictionary: Dictionary;
}) {
  const sector = sectors.find((item) => item.slug === caseStudy.sectorSlug);
  const solution = solutions.find((item) => item.slug === caseStudy.solutionSlug);

  return (
    <Link
      href={`/${locale}/projects/${caseStudy.slug}`}
      className="focus-ring group flex flex-col rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift sm:p-8"
    >
      {caseStudy.isPlaceholder ? (
        <Badge tone="pending" className="mb-4 self-start">
          {dictionary.caseStudy.placeholderBadge}
        </Badge>
      ) : null}
      <div className="flex flex-wrap gap-2 text-xs text-slate">
        {sector ? <span>{sector.title[locale]}</span> : null}
        {solution ? <span>&middot; {solution.title[locale]}</span> : null}
      </div>
      <h3 className="mt-3 text-lg font-bold text-navy">{caseStudy.clientLabel[locale]}</h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate">{caseStudy.challenge[locale]}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-orange">
        {dictionary.common.learnMore}
        <ChevronIcon className="size-4 transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
      </span>
    </Link>
  );
}
