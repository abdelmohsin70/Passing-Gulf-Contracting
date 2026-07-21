"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { otherLocale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ locale, label, className }: { locale: Locale; label: string; className?: string }) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const segments = pathname.split("/");
  segments[1] = target;
  const href = segments.join("/") || `/${target}`;

  return (
    <Link
      href={href}
      lang={target}
      className={cn(
        "focus-ring rounded-[var(--radius-pill)] border border-navy/15 px-3 py-1.5 text-sm font-semibold text-navy transition-colors hover:border-orange hover:text-orange",
        className
      )}
    >
      {label}
    </Link>
  );
}
