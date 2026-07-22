"use client";

import { useState } from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "@/components/icons/icons";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/i18n/dictionaries";

export function MobileNav({
  items,
  dictionary,
  ctaHref,
}: {
  items: { href: string; label: string }[];
  dictionary: Dictionary;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="focus-ring relative z-50 rounded-lg p-2 text-navy"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? dictionary.common.closeMenu : dictionary.common.menu}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="relative block size-6">
          <MenuIcon
            className={cn(
              "absolute inset-0 size-6 transition-all duration-200",
              open ? "scale-50 opacity-0" : "scale-100 opacity-100"
            )}
          />
          <CloseIcon
            className={cn(
              "absolute inset-0 size-6 transition-all duration-200",
              open ? "scale-100 opacity-100" : "scale-50 opacity-0"
            )}
          />
        </span>
      </button>

      <div
        id="mobile-nav-panel"
        aria-hidden={!open}
        className={cn(
          "fixed inset-x-0 top-[var(--header-h,64px)] bottom-0 z-40 overflow-y-auto bg-white px-4 pb-8 pt-4 shadow-lift transition-all duration-300 ease-out motion-reduce:transition-none",
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
        )}
      >
        <nav aria-label="mobile" className="flex flex-col gap-1">
          {items.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${index * 40}ms` : "0ms" }}
              className={cn(
                "focus-ring rounded-lg px-3 py-3 text-base font-semibold text-navy transition-all duration-300 hover:bg-sand motion-reduce:transition-none",
                open ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0 rtl:-translate-x-3"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Button href={ctaHref} className="mt-6 w-full" onClick={() => setOpen(false)}>
          {dictionary.nav.requestQuote}
        </Button>
      </div>
    </div>
  );
}
