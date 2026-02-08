import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../styles";

interface DeviceFrameProps {
  children: React.ReactNode;
  delay?: number;
  width?: number;
  height?: number;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  delay = 0,
  width = 580,
  height = 400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        width,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 36,
          background: "#1e293b",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#eab308" }} />
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22c55e" }} />
        </div>
        <div
          style={{
            flex: 1,
            height: 22,
            borderRadius: 6,
            background: "#0f172a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: 16,
          }}
        >
          <span style={{ fontSize: 11, color: colors.whiteAlpha40, fontFamily: "sans-serif" }}>
            healthharmony.app
          </span>
        </div>
      </div>

      {/* App content */}
      <div
        style={{
          height,
          background: "#f8fafc",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {children}
      </div>
    </div>
  );
};
