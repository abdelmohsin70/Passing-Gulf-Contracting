"use client";

import { useParams } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";

export default function LocaleNotFound() {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale ?? "") ? (params!.locale as typeof defaultLocale) : defaultLocale;
  const dictionary = getDictionary(locale);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-orange">404</p>
      <h1 className="mt-3 text-3xl font-bold text-navy">{dictionary.notFound.title}</h1>
      <p className="mt-3 max-w-md text-slate">{dictionary.notFound.body}</p>
      <Button href={`/${locale}`} className="mt-6">
        {dictionary.notFound.cta}
      </Button>
    </Container>
  );
}
