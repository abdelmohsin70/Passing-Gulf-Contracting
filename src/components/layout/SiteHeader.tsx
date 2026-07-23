import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { getNavItems } from "@/lib/nav-items";
import { Button } from "@/components/primitives/Button";
import { Container } from "@/components/primitives/Container";
import { MobileNav } from "@/components/layout/MobileNav";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { StickyHeaderShell } from "@/components/layout/StickyHeaderShell";
import { ClockIcon, MapPinIcon } from "@/components/icons/icons";

export function SiteHeader({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const items = getNavItems(locale, dictionary);
  const home = `/${locale}`;
  const contactHref = `/${locale}/contact`;

  return (
    <StickyHeaderShell>
      <div className="hidden border-b border-navy/5 bg-navy text-white sm:block">
        <Container className="flex items-center justify-between gap-4 py-2 text-xs">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <MapPinIcon className="size-3.5" />
              {dictionary.topbar.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="size-3.5" />
              {dictionary.topbar.availability}
            </span>
          </div>
          <LanguageSwitcher locale={locale} label={dictionary.common.language} className="border-white/20 text-white hover:border-orange hover:text-orange" />
        </Container>
      </div>

      <Container className="flex items-center justify-between gap-4 py-3.5">
        <Link href={home} className="focus-ring group flex shrink-0 items-center gap-2 rounded-lg">
          <span className="flex size-10 items-center justify-center rounded-xl bg-navy text-sm font-bold text-white transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
            {locale === "ar" ? "اج" : "IK"}
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-navy">{dictionary.meta.siteName}</span>
            <span className="text-xs text-slate">{dictionary.trust.since}</span>
          </span>
        </Link>

        <nav aria-label={locale === "ar" ? "التنقل الرئيسي" : "Primary"} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="focus-ring group relative block rounded-lg px-3 py-2 text-sm font-semibold text-navy transition-colors hover:text-orange"
                >
                  {item.label}
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 scale-x-0 rounded-full bg-orange transition-transform duration-300 group-hover:scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <LanguageSwitcher locale={locale} label={dictionary.common.language} />
          </div>
          <ThemeToggle label={dictionary.common.theme} />
          <Button href={contactHref} size="sm" className="hidden sm:inline-flex">
            {dictionary.nav.requestQuote}
          </Button>
          <MobileNav items={items} dictionary={dictionary} ctaHref={contactHref} />
        </div>
      </Container>
    </StickyHeaderShell>
  );
}
