import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { fonts, colors } from "../styles";

interface ArchitectureLayerProps {
  label: string;
  items: string[];
  colorFrom: string;
  colorTo: string;
  delay?: number;
  y: number;
}

export const ArchitectureLayer: React.FC<ArchitectureLayerProps> = ({
  label,
  items,
  colorFrom,
  colorTo,
  delay = 0,
  y,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const slideIn = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 80, mass: 0.8 },
  });

  const translateX = (1 - slideIn) * -200;

  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: "50%",
        transform: `translateX(calc(-50% + ${translateX}px))`,
        opacity: slideIn,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
      }}
    >
      {/* Layer label */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: colors.whiteAlpha60,
          fontFamily: fonts.body,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
        }}
      >
        {label}
      </div>

      {/* Items row */}
      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {items.map((item, i) => {
          const itemScale = spring({
            frame: frame - delay - i * 5,
            fps,
            config: { damping: 14, stiffness: 100, mass: 0.6 },
          });

          return (
            <div
              key={i}
              style={{
                padding: "16px 32px",
                borderRadius: 16,
                background: `linear-gradient(135deg, ${colorFrom}22, ${colorTo}22)`,
                border: `2px solid ${colorFrom}66`,
                transform: `scale(${itemScale})`,
              }}
            >
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 600,
                  color: colors.white,
                  fontFamily: fonts.body,
                }}
              >
                {item}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
