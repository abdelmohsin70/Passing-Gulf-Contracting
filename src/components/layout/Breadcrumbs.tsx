import Link from "next/link";
import { ChevronIcon } from "@/components/icons/icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="focus-ring rounded hover:text-orange">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "font-semibold text-navy" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronIcon className="size-3.5 text-slate/50" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
