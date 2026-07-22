import React from "react";

/**
 * Replaces Payload's default login-page logo with the same navy "اج"
 * badge used in the public site's header (src/components/layout/
 * SiteHeader.tsx) — plain inline styles rather than Tailwind classes,
 * since the admin panel is a separate app that doesn't compile the
 * site's Tailwind build.
 */
export function Logo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "#102a43",
          color: "#ffffff",
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        اج
      </span>
      <span style={{ fontSize: 15, fontWeight: 700, color: "#102a43" }}>اجتياز الخليج للمقاولات</span>
    </div>
  );
}
