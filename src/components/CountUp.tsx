"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts a number up from zero to its target once it scrolls into view —
 * the small motion touch modern service/app landing pages use on stat
 * bands. Non-numeric values (e.g. "24/7") are rendered as-is with no
 * animation. Fully static under prefers-reduced-motion, and it always
 * ends on the exact target so the real figure is never misrepresented.
 */
export function CountUp({ value, className, durationMs = 1200 }: { value: string; className?: string; durationMs?: number }) {
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : null;
  const suffix = match ? match[2] : "";

  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<number>(target ?? 0);

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;
    // Reduced motion: state already initializes to the target, so leave it
    // static — no synchronous setState needed.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let started = false;
    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        // easeOutCubic for a natural deceleration
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(eased * target));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true;
            setDisplay(0);
            run();
            observer.disconnect();
          }
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, durationMs]);

  if (target === null) {
    return (
      <span ref={ref} className={className} dir="ltr">
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} dir="ltr">
      {display}
      {suffix}
    </span>
  );
}
