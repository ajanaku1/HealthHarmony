import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { ParticleField } from "../components/ParticleField";
import { AnimatedLogo } from "../components/AnimatedLogo";
import { TypewriterText } from "../components/TypewriterText";
import { FadeSlide } from "../components/FadeSlide";
import { colors, fonts, column, fullSize } from "../styles";

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();

  // "Built on Gemini 3" fade-in after typewriter
  const subtitleOpacity = interpolate(frame, [180, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  // Fade out at the end of the scene
  const sceneOpacity = interpolate(frame, [310, 360], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ ...fullSize, overflow: "hidden", opacity: sceneOpacity }}>
      <GradientBackground />
      <ParticleField color={colors.brand.from} />

      <div
        style={{
          ...fullSize,
          ...column,
          gap: 24,
        }}
      >
        {/* Logo spring-in */}
        <AnimatedLogo delay={15} size={180} />

        {/* "Health Harmony" typewriter */}
        <div style={{ marginTop: 32 }}>
          <TypewriterText
            text="Health Harmony"
            delay={45}
            speed={3}
            fontSize={84}
            fontWeight={800}
            color={colors.white}
          />
        </div>

        {/* Subtitle */}
        <FadeSlide delay={140} direction="up" distance={20} duration={30}>
          <div
            style={{
              fontSize: 36,
              fontWeight: 500,
              fontFamily: fonts.body,
              letterSpacing: "-0.01em",
              marginTop: 8,
            }}
          >
            <span style={{ color: colors.whiteAlpha60 }}>Built on </span>
            <span
              style={{
                background: `linear-gradient(135deg, ${colors.brand.from}, ${colors.brand.to})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 700,
              }}
            >
              Gemini 3
            </span>
          </div>
        </FadeSlide>

        {/* Tagline */}
        <div style={{ opacity: subtitleOpacity, marginTop: 16 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: colors.whiteAlpha40,
              fontFamily: fonts.body,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Your AI-Powered Health Companion
          </span>
        </div>
      </div>
    </div>
  );
};
