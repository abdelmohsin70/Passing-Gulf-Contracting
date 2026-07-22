import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, locales } from "./i18n/config";

function pickLocaleFromAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return defaultLocale;
  const preferred = acceptLanguage
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase())
    .find((lang) => lang && locales.some((locale) => lang.startsWith(locale)));
  const match = locales.find((locale) => preferred?.startsWith(locale));
  return match ?? defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) {
    return NextResponse.next();
  }

  const locale = pickLocaleFromAcceptLanguage(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Skip internal Next.js paths, API routes, the Payload admin panel,
     * and files with an extension (static assets like /favicon.ico,
     * /robots.txt, /sitemap.xml, images).
     */
    "/((?!_next|api|admin|.*\\..*).*)",
  ],
};
