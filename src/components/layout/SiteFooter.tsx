import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { company } from "@/config/company";
import { getSolutions } from "@/payload/queries/solutions";
import { getSectors } from "@/payload/queries/sectors";
import { getSocialLinks } from "@/payload/queries/contactSettings";
import { Container } from "@/components/primitives/Container";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { MailIcon, MapPinIcon, PhoneIcon } from "@/components/icons/icons";
import { telHref } from "@/lib/utils";

export async function SiteFooter({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const base = `/${locale}`;
  const year = new Date().getFullYear();
  const [solutions, sectors, socials] = await Promise.all([getSolutions(), getSectors(), getSocialLinks()]);

  return (
    <footer className="border-t border-navy/10 bg-navy text-white">
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-10 items-center justify-center rounded-xl bg-orange text-sm font-bold text-white">
              {locale === "ar" ? "اج" : "IK"}
            </span>
            <span className="text-base font-bold">{dictionary.meta.siteName}</span>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/70">{dictionary.footer.description}</p>
          <p className="mt-4 text-xs text-white/50">
            {dictionary.trust.since} &middot; {dictionary.trust.coverage}
          </p>
          <SocialLinks socials={socials} variant="footer" className="mt-6" />
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            {dictionary.footer.solutionsHeading}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {solutions.slice(0, 6).map((solution) => (
              <li key={solution.slug}>
                <Link href={`${base}/solutions/${solution.slug}`} className="focus-ring text-white/80 hover:text-orange">
                  {solution.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            {dictionary.footer.sectorsHeading}
          </h3>
          <ul className="space-y-2.5 text-sm">
            {sectors.slice(0, 6).map((sector) => (
              <li key={sector.slug}>
                <Link href={`${base}/sectors/${sector.slug}`} className="focus-ring text-white/80 hover:text-orange">
                  {sector.title[locale]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white/60">
            {dictionary.footer.contactHeading}
          </h3>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-orange" />
              <span>
                {company.address.status === "confirmed"
                  ? company.address.value[locale]
                  : `${company.foundedCity[locale]}, ${locale === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}`}
              </span>
            </li>
            {company.phoneDisplay.status === "confirmed" && company.phoneDisplay.value ? (
              <li className="flex items-center gap-2">
                <PhoneIcon className="size-4 shrink-0 text-orange" />
                <a href={telHref(company.phone.value ?? "")} className="focus-ring hover:text-orange">
                  {company.phoneDisplay.value}
                </a>
              </li>
            ) : null}
            {company.email.status === "confirmed" ? (
              <li className="flex items-center gap-2">
                <MailIcon className="size-4 shrink-0 text-orange" />
                <a href={`mailto:${company.email.value}`} className="focus-ring hover:text-orange">
                  {company.email.value}
                </a>
              </li>
            ) : null}
            <li className="pt-1">
              <Link href={`${base}/careers`} className="focus-ring text-white/80 hover:text-orange">
                {dictionary.nav.careers}
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
          <p>
            &copy; {year} {dictionary.meta.siteName}. {dictionary.footer.rights}.
          </p>
          <Link href={`${base}/privacy`} className="focus-ring hover:text-orange">
            {dictionary.footer.privacyLink}
          </Link>
        </Container>
      </div>
    </footer>
  );
}
