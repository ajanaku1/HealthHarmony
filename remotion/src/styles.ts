import type { CSSProperties } from "react";

// Brand colors matching app's Tailwind palette
export const colors = {
  brand: { from: "#10b981", to: "#14b8a6" },
  vision: { from: "#fb923c", to: "#fbbf24" },
  video: { from: "#60a5fa", to: "#22d3ee" },
  audio: { from: "#c084fc", to: "#f472b6" },
  stream: { from: "#34d399", to: "#2dd4bf" },
  struct: { from: "#818cf8", to: "#a78bfa" },
  reason: { from: "#fb7185", to: "#f87171" },
  darkBg: "#0f172a",
  darkBgLight: "#1e293b",
  white: "#ffffff",
  whiteAlpha80: "rgba(255,255,255,0.8)",
  whiteAlpha60: "rgba(255,255,255,0.6)",
  whiteAlpha40: "rgba(255,255,255,0.4)",
  whiteAlpha20: "rgba(255,255,255,0.2)",
  whiteAlpha10: "rgba(255,255,255,0.1)",
} as const;

// Feature gradient map keyed by icon name
export const featureGradients: Record<
  string,
  { from: string; to: string }
> = {
  eye: colors.vision,
  video: colors.video,
  audio: colors.audio,
  stream: colors.stream,
  struct: colors.struct,
  reason: colors.reason,
};

// Common style helpers
export const centered: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const column: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

export const fullSize: CSSProperties = {
  width: "100%",
  height: "100%",
  position: "absolute",
  top: 0,
  left: 0,
};

export const fonts = {
  heading: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  body: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
  mono: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
};
