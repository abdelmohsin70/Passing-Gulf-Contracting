import React from "react";

/**
 * Shared brand badge for the admin panel (nav Icon + login Logo).
 *
 * A navy gradient rounded square with the "اج" monogram and the same short
 * orange underline motif the public site uses under headings and nav links
 * — so the admin mark reads as part of the brand system instead of a flat
 * coloured square. Plain inline styles: the admin is a separate app that
 * doesn't compile the site's Tailwind build.
 */
export function BrandMark({ size = 32 }: { size?: number }) {
  const radius = Math.round(size * 0.28);
  const fontSize = Math.round(size * 0.4);
  const barWidth = Math.round(size * 0.44);
  const barHeight = Math.max(2, Math.round(size * 0.07));

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: Math.max(2, Math.round(size * 0.08)),
        width: size,
        height: size,
        borderRadius: radius,
        background: "linear-gradient(145deg, #1b3a58 0%, #102a43 55%, #0a1c2e 100%)",
        boxShadow:
          "0 2px 6px rgba(10, 28, 46, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.04)",
        color: "#ffffff",
        lineHeight: 1,
      }}
    >
      <span style={{ fontSize, fontWeight: 800, letterSpacing: "0.01em", marginTop: barHeight }}>اج</span>
      <span
        style={{
          width: barWidth,
          height: barHeight,
          borderRadius: barHeight,
          background: "linear-gradient(90deg, #f36b2b, #dc581c)",
        }}
      />
    </span>
  );
}
