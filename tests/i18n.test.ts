import { describe, expect, it } from "vitest";
import { locales, localeDirection, defaultLocale, otherLocale, isLocale } from "@/i18n/config";
import ar from "@/i18n/dictionaries/ar";
import en from "@/i18n/dictionaries/en";

function collectKeyPaths(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => collectKeyPaths(item, `${prefix}[${index}]`));
  }
  if (value && typeof value === "object") {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) =>
      collectKeyPaths(nested, prefix ? `${prefix}.${key}` : key)
    );
  }
  return [prefix];
}

function collectLeafValues(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectLeafValues(item));
  }
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((nested) => collectLeafValues(nested));
  }
  return [value];
}

describe("locale configuration", () => {
  it("exposes exactly ar and en", () => {
    expect(locales).toEqual(["ar", "en"]);
  });

  it("maps ar to rtl and en to ltr", () => {
    expect(localeDirection.ar).toBe("rtl");
    expect(localeDirection.en).toBe("ltr");
  });

  it("defaults to ar", () => {
    expect(defaultLocale).toBe("ar");
  });

  it("toggles between the two locales", () => {
    expect(otherLocale("ar")).toBe("en");
    expect(otherLocale("en")).toBe("ar");
  });

  it("validates locale strings", () => {
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
  });
});

describe("dictionaries", () => {
  it("have identical key shapes between ar and en", () => {
    const arKeys = collectKeyPaths(ar).sort();
    const enKeys = collectKeyPaths(en).sort();
    expect(enKeys).toEqual(arKeys);
  });

  it("contain no empty string values", () => {
    expect(collectLeafValues(ar).filter((value) => value === "")).toEqual([]);
    expect(collectLeafValues(en).filter((value) => value === "")).toEqual([]);
  });
});
