import type { Solution } from "@/data/solutions";
import { SolutionIcon } from "@/components/sections/SolutionIcon";

export function PlaceholderGallery({ icon, label }: { icon: Solution["icon"]; label: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {[0, 1, 2, 3].map((index) => (
        <div
          key={index}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed border-navy/15 bg-sand text-navy/30"
        >
          <SolutionIcon icon={icon} className="size-8" />
          {index === 0 ? <span className="px-2 text-center text-[11px] font-medium text-navy/50">{label}</span> : null}
        </div>
      ))}
    </div>
  );
}
