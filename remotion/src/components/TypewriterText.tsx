import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { fonts } from "../styles";

interface TypewriterTextProps {
  text: string;
  delay?: number;
  speed?: number; // frames per character
  fontSize?: number;
  color?: string;
  fontWeight?: number;
  showCursor?: boolean;
  fontFamily?: string;
  style?: React.CSSProperties;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  delay = 0,
  speed = 2,
  fontSize = 72,
  color = "#ffffff",
  fontWeight = 700,
  showCursor = true,
  fontFamily = fonts.heading,
  style = {},
}) => {
  const frame = useCurrentFrame();

  const elapsed = Math.max(0, frame - delay);
  const charsToShow = Math.min(
    Math.floor(elapsed / speed),
    text.length
  );

  const displayText = text.slice(0, charsToShow);
  const isTyping = charsToShow < text.length && elapsed > 0;
  const isDone = charsToShow >= text.length;

  // Blinking cursor
  const cursorOpacity = isDone
    ? interpolate(Math.sin(frame * 0.15), [-1, 1], [0, 1])
    : isTyping
    ? 1
    : 0;

  return (
    <div
      style={{
        fontSize,
        fontWeight,
        color,
        fontFamily,
        letterSpacing: "-0.02em",
        whiteSpace: "pre",
        ...style,
      }}
    >
      {displayText}
      {showCursor && (
        <span
          style={{
            opacity: cursorOpacity,
            color,
            fontWeight: 300,
            marginLeft: 2,
          }}
        >
          |
        </span>
      )}
    </div>
  );
};
