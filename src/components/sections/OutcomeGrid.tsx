import type { Locale } from "@/i18n/config";
import { outcomes } from "@/data/outcomes";
import { TrendingDownIcon, CoinsIcon, GaugeIcon, ShieldCheckIcon } from "@/components/icons/icons";
import type { IconProps } from "@/components/icons/icons";

const iconMap: Record<string, (props: IconProps) => React.JSX.Element> = {
  downtime: TrendingDownIcon,
  cost: CoinsIcon,
  lifespan: GaugeIcon,
  safety: ShieldCheckIcon,
};

export function OutcomeGrid({ locale }: { locale: Locale }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {outcomes.map((outcome) => {
        const Icon = iconMap[outcome.id];
        return (
          <div key={outcome.id} className="rounded-[var(--radius-card)] bg-white p-6 shadow-soft">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-navy/5 text-navy">
              {Icon ? <Icon className="size-6" /> : null}
            </span>
            <h3 className="mt-4 text-base font-bold text-navy">{outcome.title[locale]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate">{outcome.description[locale]}</p>
          </div>
        );
      })}
    </div>
  );
}
