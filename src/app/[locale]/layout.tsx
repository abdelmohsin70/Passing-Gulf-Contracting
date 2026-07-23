import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, localeDirection, isLocale, defaultLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { ibmPlexSansArabic, inter } from "@/lib/fonts";
import { company } from "@/config/company";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { SkipLink } from "@/components/layout/SkipLink";
import { AnalyticsScript } from "@/components/AnalyticsScript";
import { organizationJsonLd } from "@/lib/seo";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const dictionary = getDictionary(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dictionary.meta.siteName} | ${dictionary.meta.tagline}`,
      template: `%s | ${dictionary.meta.siteName}`,
    },
    description: dictionary.meta.tagline,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      siteName: dictionary.meta.siteName,
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale = localeParam;
  const dictionary = getDictionary(locale);
  const direction = localeDirection[locale];

  return (
    <html
      lang={locale}
      dir={direction}
      className={`${ibmPlexSansArabic.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Apply the saved/system theme before first paint to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd(locale)) }}
        />
        <SkipLink dictionary={dictionary} />
        <SiteHeader locale={locale} dictionary={dictionary} />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <SiteFooter locale={locale} dictionary={dictionary} />
        <WhatsAppButton number={company.whatsapp.status === "confirmed" ? company.whatsapp.value : null} label={dictionary.common.whatsapp} />
        <AnalyticsScript />
      </body>
    </html>
  );
}
