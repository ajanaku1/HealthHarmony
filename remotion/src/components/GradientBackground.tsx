import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { fullSize, colors } from "../styles";

interface GradientBackgroundProps {
  colorFrom?: string;
  colorTo?: string;
  opacity?: number;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colorFrom = colors.darkBg,
  colorTo = colors.darkBgLight,
  opacity = 1,
}) => {
  const frame = useCurrentFrame();

  // Slow animated gradient angle
  const angle = interpolate(frame, [0, 300], [135, 180], {
    extrapolateRight: "extend",
  });

  return (
    <div
      style={{
        ...fullSize,
        background: `linear-gradient(${angle}deg, ${colorFrom}, ${colorTo})`,
        opacity,
      }}
    />
  );
};
