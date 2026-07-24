"use client";

import { useEffect } from "react";
import { useLocale, useTranslation } from "@payloadcms/ui";

/**
 * Single language control for the admin.
 *
 * The admin used to show two separate switchers that looked alike but did
 * different things: Payload's native content-Locale selector (which set of
 * localized field values you edit) and a custom UI-language toggle (the
 * admin chrome language). Editors found that confusing.
 *
 * We now keep only the native Locale selector and make the interface
 * language follow it: whenever the selected content locale changes, this
 * (renderless) component switches the admin UI language to match via
 * Payload's own `switchLanguage` server action. So one control changes
 * both — pick العربية and everything is Arabic; pick English and
 * everything is English.
 */
export function LocaleLanguageSync() {
  const locale = useLocale();
  const { i18n, switchLanguage } = useTranslation();

  useEffect(() => {
    const target = locale?.code === "en" ? "en" : "ar";
    if (switchLanguage && i18n.language !== target) {
      void switchLanguage(target);
    }
  }, [locale, i18n.language, switchLanguage]);

  return null;
}
