import React from "react";
import { interpolate, useCurrentFrame, Easing } from "remotion";

interface FadeSlideProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
  style?: React.CSSProperties;
}

export const FadeSlide: React.FC<FadeSlideProps> = ({
  children,
  direction = "up",
  delay = 0,
  duration = 20,
  distance = 40,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  const rawOffset = interpolate(frame, [delay, delay + duration], [distance, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  const translateMap: Record<string, string> = {
    up: `translateY(${rawOffset}px)`,
    down: `translateY(${-rawOffset}px)`,
    left: `translateX(${rawOffset}px)`,
    right: `translateX(${-rawOffset}px)`,
  };

  return (
    <div
      style={{
        opacity,
        transform: translateMap[direction],
        ...style,
      }}
    >
      {children}
    </div>
  );
};
