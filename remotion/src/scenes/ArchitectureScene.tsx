import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { ArchitectureLayer } from "../components/ArchitectureLayer";
import { FadeSlide } from "../components/FadeSlide";
import { colors, fonts, fullSize } from "../styles";

export const ArchitectureScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade in at start
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [400, 450], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated SVG connector lines between layers
  const lineProgress1 = interpolate(frame, [60, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  const lineProgress2 = interpolate(frame, [120, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  return (
    <div style={{ ...fullSize, overflow: "hidden", opacity: fadeIn * fadeOut }}>
      <GradientBackground />

      {/* Scene title */}
      <FadeSlide delay={5} direction="up" distance={30} duration={25}>
        <div
          style={{
            position: "absolute",
            top: 80,
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: colors.white,
              fontFamily: fonts.heading,
              letterSpacing: "-0.03em",
            }}
          >
            Architecture
          </span>
        </div>
      </FadeSlide>

      {/* Architecture layers */}
      <ArchitectureLayer
        label="Frontend"
        items={["React SPA", "Tailwind CSS", "Recharts"]}
        colorFrom={colors.brand.from}
        colorTo={colors.brand.to}
        delay={20}
        y={220}
      />

      {/* Connector line 1 */}
      <svg
        style={{ position: "absolute", top: 310, left: "50%", transform: "translateX(-50%)" }}
        width={4}
        height={80}
      >
        <line
          x1={2}
          y1={0}
          x2={2}
          y2={80 * lineProgress1}
          stroke={colors.brand.from}
          strokeWidth={3}
          strokeDasharray="6 4"
          opacity={0.6}
        />
        {/* Arrow head */}
        {lineProgress1 > 0.9 && (
          <polygon
            points="2,80 -4,68 8,68"
            fill={colors.brand.from}
            opacity={0.6}
          />
        )}
      </svg>

      <ArchitectureLayer
        label="Serverless API"
        items={["Vercel Functions", "Edge Runtime"]}
        colorFrom={colors.video.from}
        colorTo={colors.video.to}
        delay={60}
        y={410}
      />

      {/* Connector line 2 */}
      <svg
        style={{ position: "absolute", top: 500, left: "50%", transform: "translateX(-50%)" }}
        width={4}
        height={80}
      >
        <line
          x1={2}
          y1={0}
          x2={2}
          y2={80 * lineProgress2}
          stroke={colors.video.from}
          strokeWidth={3}
          strokeDasharray="6 4"
          opacity={0.6}
        />
        {lineProgress2 > 0.9 && (
          <polygon
            points="2,80 -4,68 8,68"
            fill={colors.video.from}
            opacity={0.6}
          />
        )}
      </svg>

      <ArchitectureLayer
        label="Backend Services"
        items={["Gemini 3 API", "Firebase Auth", "Cloud Firestore"]}
        colorFrom={colors.audio.from}
        colorTo={colors.audio.to}
        delay={120}
        y={600}
      />

      {/* Bottom subtitle */}
      <FadeSlide delay={180} direction="up" distance={20} duration={30}>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            width: "100%",
            textAlign: "center",
          }}
        >
          <span
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: colors.whiteAlpha40,
              fontFamily: fonts.body,
              letterSpacing: "0.05em",
            }}
          >
            Fully serverless — zero backend infrastructure to manage
          </span>
        </div>
      </FadeSlide>
    </div>
  );
};
