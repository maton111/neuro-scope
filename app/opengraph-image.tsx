import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NeuroScope — Real-time Cognitive Presence Analysis";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#080808",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,245,212,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,212,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0,245,212,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px", marginBottom: "24px" }}>
          <span style={{ color: "#00f5d4", fontSize: "18px", letterSpacing: "4px" }}>NEURO</span>
          <span style={{ color: "#ffffff", fontSize: "18px", letterSpacing: "4px" }}>SCOPE</span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: "900px",
          }}
        >
          Your brain on a{" "}
          <span style={{ color: "#00f5d4" }}>dashboard</span>.
        </div>

        {/* Sub */}
        <div
          style={{
            marginTop: "24px",
            fontSize: "20px",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            maxWidth: "700px",
            fontFamily: "monospace",
          }}
        >
          Real-time cognitive presence analysis · Browser-only · No data uploaded
        </div>

        {/* Floating chips */}
        {[
          { label: "FOCUS", value: "87", left: "80px", top: "180px" },
          { label: "STATE", value: "LOCKED IN", right: "80px", top: "200px" },
          { label: "GAZE", value: "94", left: "80px", bottom: "160px" },
          { label: "FATIGUE", value: "12%", right: "80px", bottom: "160px" },
        ].map((chip) => (
          <div
            key={chip.label}
            style={{
              position: "absolute",
              left: chip.left,
              right: chip.right,
              top: chip.top,
              bottom: chip.bottom,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(0,245,212,0.2)",
              borderRadius: "12px",
              padding: "12px 16px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "2px" }}>
              {chip.label}
            </span>
            <span style={{ color: "#00f5d4", fontSize: "16px", fontWeight: "bold" }}>
              {chip.value}
            </span>
          </div>
        ))}
      </div>
    ),
    { ...size }
  );
}