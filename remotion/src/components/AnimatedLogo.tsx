import React from "react";
import { Img, spring, useCurrentFrame, useVideoConfig, staticFile } from "remotion";

interface AnimatedLogoProps {
  delay?: number;
  size?: number;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  delay = 0,
  size = 180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
      stiffness: 100,
      mass: 0.8,
    },
  });

  const opacity = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 20,
      stiffness: 80,
      mass: 0.5,
    },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Img
        src={staticFile("HHlogo.png")}
        style={{
          width: size,
          height: size,
          transform: `scale(${scale})`,
          opacity,
          borderRadius: 24,
        }}
      />
    </div>
  );
};
