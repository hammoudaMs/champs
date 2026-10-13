import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#2F3B2A",
          color: "#FAF8F3",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", opacity: 0.8 }}>
          Self-service
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 16, lineHeight: 1.05 }}>
          Café Champ&apos;s
        </div>
        <div style={{ fontSize: 32, marginTop: 24, opacity: 0.85, maxWidth: 800 }}>
          Commandez depuis votre table — sans file d&apos;attente.
        </div>
      </div>
    ),
    size,
  );
}
