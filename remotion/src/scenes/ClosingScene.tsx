import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { ParticleField } from "../components/ParticleField";
import { AnimatedLogo } from "../components/AnimatedLogo";
import { TypewriterText } from "../components/TypewriterText";
import { CapabilityBadge } from "../components/CapabilityBadge";
import { colors, fonts, column, fullSize } from "../styles";

const badges = [
  { label: "Vision", from: colors.vision.from, to: colors.vision.to },
  { label: "Video", from: colors.video.from, to: colors.video.to },
  { label: "Audio", from: colors.audio.from, to: colors.audio.to },
  { label: "Streaming", from: colors.stream.from, to: colors.stream.to },
  { label: "Structured", from: colors.struct.from, to: colors.struct.to },
  { label: "Reasoning", from: colors.reason.from, to: colors.reason.to },
];

export const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Fade to black at the very end
  const fadeToBlack = interpolate(frame, [310, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ ...fullSize, overflow: "hidden" }}>
      <GradientBackground />
      <ParticleField color={colors.brand.from} />

      <div
        style={{
          ...fullSize,
          ...column,
          gap: 28,
        }}
      >
        {/* Logo return */}
        <AnimatedLogo delay={10} size={140} />

        {/* Typewriter tagline */}
        <div style={{ marginTop: 24 }}>
          <TypewriterText
            text="6 Capabilities. One App."
            delay={30}
            speed={2}
            fontSize={64}
            fontWeight={800}
            color={colors.white}
          />
        </div>

        {/* Badge row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
            marginTop: 32,
            maxWidth: 1200,
          }}
        >
          {badges.map((badge, i) => (
            <CapabilityBadge
              key={badge.label}
              label={badge.label}
              colorFrom={badge.from}
              colorTo={badge.to}
              delay={120 + i * 8}
            />
          ))}
        </div>

        {/* Powered by line */}
        <div
          style={{
            marginTop: 40,
            opacity: interpolate(frame, [200, 240], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <span
            style={{
              fontSize: 22,
              color: colors.whiteAlpha40,
              fontFamily: fonts.body,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Powered by Google Gemini 3 API
          </span>
        </div>
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          ...fullSize,
          backgroundColor: "#000000",
          opacity: fadeToBlack,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};
