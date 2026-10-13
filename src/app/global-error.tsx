"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#FAF8F3",
          color: "#1A1A1A",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <p style={{ letterSpacing: "0.28em", textTransform: "uppercase", fontSize: 11 }}>
            Café Champ&apos;s
          </p>
          <h1 style={{ fontSize: 32, marginTop: 12 }}>Une erreur est survenue</h1>
          <p style={{ color: "#6B6B6B", marginTop: 8, fontSize: 14 }}>
            {error.message || "Réessayez dans un instant."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 24,
              minHeight: 48,
              borderRadius: 12,
              border: 0,
              background: "#2F3B2A",
              color: "#fff",
              padding: "0 24px",
              fontWeight: 600,
            }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
