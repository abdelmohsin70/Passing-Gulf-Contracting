import React from "react";

/** Replaces Payload's default nav icon with the site's "اج" badge. */
export function Icon() {
  return (
    <span
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 28,
        height: 28,
        borderRadius: 8,
        background: "#f36b2b",
        color: "#ffffff",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      اج
    </span>
  );
}
