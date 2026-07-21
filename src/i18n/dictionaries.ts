import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/types";
import ar from "./dictionaries/ar";
import en from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { ar, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
