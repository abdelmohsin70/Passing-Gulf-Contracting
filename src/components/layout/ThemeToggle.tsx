"use client";

import { useSyncExternalStore } from "react";
import { SunIcon, MoonIcon } from "@/components/icons/icons";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  window.addEventListener("themechange", onChange);
  return () => window.removeEventListener("themechange", onChange);
}

/**
 * Light/dark theme toggle. The initial theme is applied before paint by an
 * inline script in the locale layout; this control reads the current
 * <html data-theme> via useSyncExternalStore (SSR snapshot is null so the
 * icon only renders after hydration), flips it, and persists the choice.
 */
export function ThemeToggle({ label }: { label: { light: string; dark: string } }) {
  const theme = useSyncExternalStore<Theme | null>(
    subscribe,
    () => (document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light"),
    () => null
  );

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage failures (private mode etc.)
    }
    // Nudge the external-store subscribers so the icon updates immediately.
    window.dispatchEvent(new Event("themechange"));
  }

  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? label.light : label.dark}
      className="focus-ring flex size-9 items-center justify-center rounded-full border border-navy/15 text-navy transition-colors hover:border-orange hover:text-orange"
    >
      {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
    </button>
  );
}
