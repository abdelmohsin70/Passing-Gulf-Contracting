import Link from "next/link";
import { ChevronIcon } from "@/components/icons/icons";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const isDark = tone === "dark";

  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className={cn("flex flex-wrap items-center gap-1.5 text-sm", isDark ? "text-white/70" : "text-slate")}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="focus-ring rounded hover:text-orange">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? cn("font-semibold", isDark ? "text-white" : "text-navy") : undefined}
                >
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronIcon className={cn("size-3.5", isDark ? "text-white/40" : "text-slate/50")} /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
