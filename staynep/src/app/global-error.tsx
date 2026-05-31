"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0D1B3E", color: "#fff", fontFamily: "system-ui" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Application error</h1>
          <p style={{ marginTop: "0.5rem", color: "#9CA3AF", fontSize: "0.875rem" }}>
            {error.message || "Please restart the dev server."}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              padding: "0.625rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              background: "#C9A24A",
              color: "#0D1B3E",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
