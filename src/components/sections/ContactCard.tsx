import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { company } from "@/config/company";
import { telHref, whatsappHref } from "@/lib/utils";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons/icons";
import { Badge } from "@/components/primitives/Badge";
import { TrackedLink } from "@/components/TrackedLink";

export function ContactCard({ locale, dictionary }: { locale: Locale; dictionary: Dictionary }) {
  const hasPhone = company.phone.status === "confirmed" && company.phone.value;
  const hasWhatsapp = company.whatsapp.status === "confirmed" && company.whatsapp.value;
  const hasEmail = company.email.status === "confirmed";
  const hasAddress = company.address.status === "confirmed";

  return (
    <div className="rounded-[var(--radius-card)] border border-navy/10 bg-white p-6 shadow-soft sm:p-8">
      <h2 className="text-lg font-bold text-navy">{dictionary.contact.directTitle}</h2>

      <dl className="mt-6 space-y-5 text-sm">
        <div className="flex items-start gap-3">
          <MapPinIcon className="mt-0.5 size-5 shrink-0 text-orange" />
          <div>
            <dt className="font-semibold text-navy">{dictionary.contact.addressLabel}</dt>
            <dd className="mt-0.5 text-slate">
              {hasAddress
                ? company.address.value[locale]
                : `${company.foundedCity[locale]}, ${locale === "ar" ? "المملكة العربية السعودية" : "Saudi Arabia"}`}
            </dd>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <ClockIcon className="mt-0.5 size-5 shrink-0 text-orange" />
          <div>
            <dt className="font-semibold text-navy">{dictionary.contact.hoursLabel}</dt>
            <dd className="mt-0.5 text-slate">{dictionary.contact.hoursValue}</dd>
          </div>
        </div>

        {hasPhone ? (
          <div className="flex items-start gap-3">
            <PhoneIcon className="mt-0.5 size-5 shrink-0 text-orange" />
            <div>
              <dt className="font-semibold text-navy">{dictionary.contact.phoneLabel}</dt>
              <dd className="mt-0.5">
                <TrackedLink
                  event="phone_click"
                  href={telHref(company.phone.value as string)}
                  className="focus-ring text-slate hover:text-orange"
                >
                  {company.phoneDisplay.value}
                </TrackedLink>
              </dd>
            </div>
          </div>
        ) : null}

        {hasEmail ? (
          <div className="flex items-start gap-3">
            <MailIcon className="mt-0.5 size-5 shrink-0 text-orange" />
            <div>
              <dt className="font-semibold text-navy">{dictionary.contact.emailLabel}</dt>
              <dd className="mt-0.5">
                <a href={`mailto:${company.email.value}`} className="focus-ring text-slate hover:text-orange">
                  {company.email.value}
                </a>
              </dd>
            </div>
          </div>
        ) : null}
      </dl>

      {!hasPhone || !hasEmail || !hasAddress ? (
        <p className="mt-6">
          <Badge tone="pending">{dictionary.contact.pendingContact}</Badge>
        </p>
      ) : null}

      {hasWhatsapp ? (
        <TrackedLink
          event="whatsapp_click"
          params={{ source: "contact_card" }}
          href={whatsappHref(company.whatsapp.value as string)}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-ring mt-6 flex items-center justify-center gap-2 rounded-[var(--radius-pill)] bg-success px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-success/90"
        >
          <WhatsAppIcon className="size-4" />
          {dictionary.common.whatsapp}
        </TrackedLink>
      ) : null}
    </div>
  );
}
