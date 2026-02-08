import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts } from "../styles";

interface CapabilityBadgeProps {
  label: string;
  colorFrom: string;
  colorTo: string;
  delay?: number;
}

export const CapabilityBadge: React.FC<CapabilityBadgeProps> = ({
  label,
  colorFrom,
  colorTo,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 24px",
        borderRadius: 50,
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
        transform: `scale(${scale})`,
        margin: "0 8px",
      }}
    >
      <span
        style={{
          color: "#fff",
          fontSize: 20,
          fontWeight: 600,
          fontFamily: fonts.body,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
    </div>
  );
};
