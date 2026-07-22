"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Stagger delay in ms — pass index * 80 inside a .map() for a cascading effect. */
  delay?: number;
  /** "up" (default) fades in while rising; "scale" fades in while growing slightly. */
  variant?: "up" | "scale" | "fade";
};

/** Safety net: never leave content invisible for longer than this, no matter what. */
const MAX_WAIT_MS = 900;

/**
 * Reveals its children with a subtle fade/rise once they scroll into view.
 * Pure CSS transition driven by an IntersectionObserver — no animation
 * library needed. Fully inert under prefers-reduced-motion (see
 * `motion-reduce:` classes and the global override in globals.css).
 *
 * This is a purely decorative enhancement, so it must never be able to
 * leave real content permanently hidden (e.g. if IntersectionObserver
 * behaves unexpectedly, or the element is already in view when JS hasn't
 * attached yet). A capped fallback timer forces visibility regardless.
 */
export function Reveal({ children, className, id, delay = 0, variant = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let settled = false;
    const reveal = () => {
      if (settled) return;
      settled = true;
      setVisible(true);
    };

    // Belt-and-suspenders: guarantee content becomes visible even if the
    // observer never reports intersection for some reason.
    const fallback = window.setTimeout(reveal, MAX_WAIT_MS);

    let observer: IntersectionObserver | undefined;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
      );
      observer.observe(el);
    } catch {
      reveal();
    }

    return () => {
      window.clearTimeout(fallback);
      observer?.disconnect();
    };
  }, []);

  const hiddenState = {
    up: "opacity-0 translate-y-6",
    scale: "opacity-0 scale-95",
    fade: "opacity-0",
  }[variant];

  return (
    <div
      ref={ref}
      id={id}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out",
        "motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:scale-100",
        visible ? "opacity-100 translate-y-0 scale-100" : hiddenState,
        className
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
