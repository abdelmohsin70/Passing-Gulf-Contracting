import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Sector } from "@/data/sectors";
import { SectorIcon } from "@/components/sections/SectorIcon";

export function SectorCard({ sector, locale, href }: { sector: Sector; locale: Locale; href?: string }) {
  return (
    <Link
      href={href ?? `/${locale}/sectors#${sector.slug}`}
      id={href ? undefined : sector.slug}
      className="focus-ring group flex flex-col items-start rounded-[var(--radius-card)] border border-navy/10 bg-sand p-6 transition-all hover:-translate-y-1 hover:border-orange/40 hover:bg-white hover:shadow-soft"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-navy text-white">
        <SectorIcon icon={sector.icon} className="size-5" />
      </span>
      <h3 className="mt-4 text-base font-bold text-navy">{sector.title[locale]}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate">{sector.description[locale]}</p>
    </Link>
  );
}
