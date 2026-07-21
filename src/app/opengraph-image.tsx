import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          backgroundColor: "#102A43",
          padding: "80px",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 88,
            height: 88,
            borderRadius: 20,
            backgroundColor: "#F36B2B",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 36,
            fontWeight: 700,
            marginBottom: 40,
          }}
        >
          IK
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 700, lineHeight: 1.2, maxWidth: 900 }}>
          Ijtiyaz Al Khaleej Contracting
        </div>
        <div style={{ display: "flex", fontSize: 28, marginTop: 24, color: "rgba(255,255,255,0.75)", maxWidth: 820 }}>
          Facility Management, Operation &amp; Maintenance across Saudi Arabia
        </div>
      </div>
    ),
    { ...size }
  );
}
