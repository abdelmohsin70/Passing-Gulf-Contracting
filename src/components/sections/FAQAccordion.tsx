import type { Locale } from "@/i18n/config";
import type { FAQItem } from "@/data/solutions";
import { ChevronDownIcon } from "@/components/icons/icons";

export function FAQAccordion({ items, locale }: { items: FAQItem[]; locale: Locale }) {
  return (
    <div className="divide-y divide-navy/10 rounded-[var(--radius-card)] border border-navy/10 bg-white">
      {items.map((item, index) => (
        <details key={index} className="group p-5 sm:p-6" {...(index === 0 ? { open: true } : {})}>
          <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy marker:content-none">
            <span>{item.question[locale]}</span>
            <ChevronDownIcon className="size-5 shrink-0 text-orange transition-transform group-open:rotate-180" />
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-slate">{item.answer[locale]}</p>
        </details>
      ))}
    </div>
  );
}
