import { describe, expect, it } from "vitest";
import { getNavItems } from "@/lib/nav-items";
import { getDictionary } from "@/i18n/dictionaries";
import { locales } from "@/i18n/config";

const knownRoutes = new Set([
  "/solutions",
  "/sectors",
  "/projects",
  "/about",
  "/quality-safety",
  "/contact",
]);

describe("primary navigation", () => {
  it.each(locales)("every nav item for '%s' points to a known top-level route", (locale) => {
    const items = getNavItems(locale, getDictionary(locale));
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.href.startsWith(`/${locale}/`)).toBe(true);
      const routePath = item.href.replace(`/${locale}`, "");
      expect(knownRoutes.has(routePath), `unknown route: ${item.href}`).toBe(true);
      expect(item.label.length).toBeGreaterThan(0);
    }
  });
});
