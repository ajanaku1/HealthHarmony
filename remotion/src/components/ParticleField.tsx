import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fullSize } from "../styles";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

// Deterministic seeded random for consistent renders
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    x: seededRandom(i * 3 + 1) * 1920,
    y: seededRandom(i * 3 + 2) * 1080,
    size: 2 + seededRandom(i * 3 + 3) * 4,
    speed: 0.3 + seededRandom(i * 3 + 4) * 0.7,
    opacity: 0.15 + seededRandom(i * 3 + 5) * 0.35,
  }));
}

const particles = generateParticles(60);

interface ParticleFieldProps {
  color?: string;
  count?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  color = "#10b981",
}) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ ...fullSize, overflow: "hidden", pointerEvents: "none" }}>
      {particles.map((p, i) => {
        // Gentle floating motion
        const yOffset = Math.sin((frame * p.speed * 0.02) + i) * 20;
        const xOffset = Math.cos((frame * p.speed * 0.015) + i * 0.5) * 15;

        // Pulse opacity
        const pulseOpacity = interpolate(
          Math.sin(frame * 0.03 + i * 0.7),
          [-1, 1],
          [p.opacity * 0.5, p.opacity]
        );

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x + xOffset,
              top: p.y + yOffset,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: pulseOpacity,
            }}
          />
        );
      })}
    </div>
  );
};
