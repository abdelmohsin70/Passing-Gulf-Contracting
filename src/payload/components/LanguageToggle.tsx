"use client";

import React, { useSyncExternalStore } from "react";

/**
 * One-click admin-UI language toggle (عربي ⇄ English), shown in the admin
 * header next to the content Locale picker. Payload does ship a language
 * selector, but it's buried in the Account page; editors kept missing it.
 * Sets the same `payload-lng` cookie Payload's own switcher uses, then
 * reloads so the whole chrome (nav, buttons, system messages) re-renders
 * in the chosen language.
 */
const emptySubscribe = () => () => {};

export function LanguageToggle() {
  // The current UI language lives on <html lang>, set by the server per
  // request — read it via useSyncExternalStore so SSR renders nothing
  // (null server snapshot) and the client hydrates with the real value.
  const lang = useSyncExternalStore(
    emptySubscribe,
    () => document.documentElement.lang || "en",
    () => null
  );

  if (!lang) return null;

  const isArabic = lang.startsWith("ar");
  const next = isArabic ? "en" : "ar";

  const switchLanguage = () => {
    document.cookie = `payload-lng=${next};path=/;max-age=${60 * 60 * 24 * 365}`;
    window.location.reload();
  };

  return (
    <button
      type="button"
      onClick={switchLanguage}
      aria-label={isArabic ? "Switch admin language to English" : "تبديل لغة اللوحة إلى العربية"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 8,
        border: "1px solid rgba(16, 42, 67, 0.15)",
        background: "#ffffff",
        color: "#102a43",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f36b2b"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {isArabic ? "English" : "عربي"}
    </button>
  );
}
