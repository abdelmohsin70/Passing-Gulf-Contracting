import React from "react";
import { BrandMark } from "./BrandMark";

/**
 * Replaces Payload's default login-page logo with the brand badge plus the
 * company wordmark, matching the public site's header identity.
 */
export function Logo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <BrandMark size={60} />
      <span style={{ fontSize: 15, fontWeight: 700, color: "var(--theme-text, #102a43)", letterSpacing: "0.01em" }}>
        اجتياز الخليج للمقاولات
      </span>
    </div>
  );
}
