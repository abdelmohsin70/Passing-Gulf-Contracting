"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { Container } from "@/components/primitives/Container";
import { Button } from "@/components/primitives/Button";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale?: string }>();
  const locale = isLocale(params?.locale ?? "") ? (params!.locale as typeof defaultLocale) : defaultLocale;
  const dictionary = getDictionary(locale);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[50vh] flex-col items-center justify-center py-24 text-center">
      <h1 className="text-2xl font-bold text-navy">{dictionary.error.title}</h1>
      <p className="mt-3 max-w-md text-slate">{dictionary.error.body}</p>
      <Button onClick={reset} className="mt-6">
        {dictionary.error.retry}
      </Button>
    </Container>
  );
}
