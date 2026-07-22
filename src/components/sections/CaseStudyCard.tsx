import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { CaseStudy } from "@/data/projects";
import type { Sector } from "@/data/sectors";
import type { Solution } from "@/data/solutions";
import { Badge } from "@/components/primitives/Badge";
import { ChevronIcon } from "@/components/icons/icons";

export function CaseStudyCard({
  caseStudy,
  locale,
  dictionary,
  sectors,
  solutions,
}: {
  caseStudy: CaseStudy;
  locale: Locale;
  dictionary: Dictionary;
  sectors: Sector[];
  solutions: Solution[];
}) {
  const sector = sectors.find((item) => item.slug === caseStudy.sectorSlug);
  const solution = solutions.find((item) => item.slug === caseStudy.solutionSlug);

  return (
    <Link
      href={`/${locale}/projects/${caseStudy.slug}`}
      className="focus-ring group flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-navy/10 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
    >
      {caseStudy.image ? (
        <div className="relative h-44 w-full overflow-hidden">
          <Image
            src={caseStudy.image}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 via-transparent to-transparent" />
          {caseStudy.isPlaceholder ? (
            <Badge tone="pending" className="absolute start-3 top-3">
              {dictionary.caseStudy.placeholderBadge}
            </Badge>
          ) : null}
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        {caseStudy.isPlaceholder && !caseStudy.image ? (
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
      </div>
    </Link>
  );
}
