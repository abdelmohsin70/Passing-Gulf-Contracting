"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StickyHeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-300",
        scrolled ? "border-navy/10 shadow-soft" : "border-transparent"
      )}
    >
      {children}
    </header>
  );
}
