import type { Locale } from "@/i18n/config";
import { processSteps } from "@/data/process";

export function ProcessTimeline({ locale }: { locale: Locale }) {
  return (
    <ol className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {processSteps.map((step) => (
        <li
          key={step.step}
          className="relative rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
            {step.step}
          </span>
          <h3 className="mt-4 text-base font-bold text-navy">{step.title[locale]}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate">{step.description[locale]}</p>
        </li>
      ))}
    </ol>
  );
}
