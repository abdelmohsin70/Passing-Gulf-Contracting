import type { Dictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

export function getNavItems(locale: Locale, dictionary: Dictionary) {
  const base = `/${locale}`;
  return [
    { href: `${base}/solutions`, label: dictionary.nav.solutions },
    { href: `${base}/sectors`, label: dictionary.nav.sectors },
    { href: `${base}/projects`, label: dictionary.nav.projects },
    { href: `${base}/insights`, label: dictionary.nav.insights },
    { href: `${base}/about`, label: dictionary.nav.about },
    { href: `${base}/quality-safety`, label: dictionary.nav.qualitySafety },
    { href: `${base}/contact`, label: dictionary.nav.contact },
  ];
}
