"use client";

import { useState } from "react";
import Link from "next/link";
import { CloseIcon, MenuIcon } from "@/components/icons/icons";
import { Button } from "@/components/primitives/Button";
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
        className="focus-ring rounded-lg p-2 text-navy"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? dictionary.common.closeMenu : dictionary.common.menu}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon className="size-6" /> : <MenuIcon className="size-6" />}
      </button>

      {open ? (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-[var(--header-h,64px)] bottom-0 z-40 overflow-y-auto bg-white px-4 pb-8 pt-4 shadow-lift"
        >
          <nav aria-label="mobile" className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-lg px-3 py-3 text-base font-semibold text-navy hover:bg-sand"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button href={ctaHref} className="mt-6 w-full" onClick={() => setOpen(false)}>
            {dictionary.nav.requestQuote}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
