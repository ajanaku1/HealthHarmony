import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
  Sequence,
} from "remotion";
import { GradientBackground } from "../components/GradientBackground";
import { FeatureCard } from "../components/FeatureCard";
import { DeviceFrame } from "../components/DeviceFrame";
import { FEATURES, FEATURE_FRAMES } from "../constants";
import { colors, fonts, fullSize } from "../styles";

/* =========================================================================
   REALISTIC APP SCREEN MOCKS — each mimics the actual HealthHarmony UI
   ========================================================================= */

/* ---- Shared styles that match the real app's Tailwind-based look ---- */
const appBg = "#f8fafc"; // slate-50
const cardBg = "#ffffff";
const cardBorder = "#e2e8f0"; // slate-200
const textPrimary = "#0f172a"; // slate-900
const textSecondary = "#64748b"; // slate-500
const textMuted = "#94a3b8"; // slate-400
const emerald500 = "#10b981";
const emerald50 = "#ecfdf5";
const orange400 = "#fb923c";
const blue400 = "#60a5fa";
const purple400 = "#c084fc";

const appFont = fonts.body;

// Tiny Gemini badge used throughout the app
const GeminiBadge: React.FC = () => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 8px",
      borderRadius: 50,
      background: "linear-gradient(135deg, #10b981, #14b8a6)",
      fontSize: 9,
      fontWeight: 700,
      color: "#fff",
      fontFamily: appFont,
      letterSpacing: "0.02em",
    }}
  >
    Gemini
  </span>
);

// Mini nav bar at top of every screen mock
const AppNavBar: React.FC<{ title: string }> = ({ title }) => (
  <div
    style={{
      height: 40,
      background: cardBg,
      borderBottom: `1px solid ${cardBorder}`,
      display: "flex",
      alignItems: "center",
      padding: "0 16px",
      gap: 8,
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        background: "linear-gradient(135deg, #10b981, #14b8a6)",
      }}
    />
    <span style={{ fontSize: 13, fontWeight: 700, color: textPrimary, fontFamily: appFont }}>
      {title}
    </span>
  </div>
);

/* ---------- 1. MEAL ANALYZER SCREEN ---------- */
const MealAnalyzerScreen: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Show photo uploading (0-30)
  // Phase 2: Show "Analyzing..." spinner (30-70)
  // Phase 3: Show nutrition results (70+)
  const photoOpacity = interpolate(frame, [8, 25], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const showAnalyzing = frame >= 35 && frame < 75;

  const resultsOpacity = interpolate(frame, [75, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const proteinWidth = interpolate(frame, [85, 130], [0, 76], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });
  const carbsWidth = interpolate(frame, [95, 140], [0, 44], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });
  const fatWidth = interpolate(frame, [105, 150], [0, 36], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  return (
    <div style={{ background: appBg, height: "100%", fontFamily: appFont }}>
      <AppNavBar title="Meal Analyzer" />
      <div style={{ padding: 16 }}>
        {/* Header */}
        <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
          Meal Analyzer
        </div>
        <div style={{ fontSize: 10, color: textSecondary, marginBottom: 12 }}>
          Take a photo of your meal for AI nutritional analysis
        </div>

        {/* Photo upload area / uploaded photo */}
        <div
          style={{
            width: "100%",
            height: 120,
            borderRadius: 12,
            overflow: "hidden",
            border: `2px dashed ${cardBorder}`,
            background: frame < 15 ? "#f1f5f9" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
            position: "relative",
          }}
        >
          {frame < 15 ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24 }}>📸</div>
              <div style={{ fontSize: 9, color: textMuted, marginTop: 4 }}>
                Drop a meal photo or click to upload
              </div>
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                opacity: photoOpacity,
                background: "linear-gradient(135deg, #fef3c7, #fed7aa, #fecaca)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              {/* Fake food photo representation */}
              <div style={{ fontSize: 36 }}>🥗</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#92400e" }}>
                  grilled_chicken_salad.jpg
                </div>
                <div style={{ fontSize: 9, color: "#b45309" }}>2.4 MB</div>
              </div>
            </div>
          )}
        </div>

        {/* Analyze button */}
        {frame >= 25 && frame < 75 && (
          <div
            style={{
              width: "100%",
              height: 34,
              borderRadius: 10,
              background: showAnalyzing
                ? "linear-gradient(135deg, #10b981, #14b8a6)"
                : "linear-gradient(135deg, #10b981, #14b8a6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              marginBottom: 12,
            }}
          >
            {showAnalyzing ? (
              <>
                <div
                  style={{
                    width: 14,
                    height: 14,
                    border: "2px solid white",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    transform: `rotate(${frame * 8}deg)`,
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
                  Analyzing your meal...
                </span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 12 }}>✨</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
                  Analyze with Gemini
                </span>
              </>
            )}
          </div>
        )}

        {/* Results card */}
        {frame >= 75 && (
          <div
            style={{
              opacity: resultsOpacity,
              background: cardBg,
              borderRadius: 12,
              padding: 14,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>
                  Grilled Chicken Salad
                </div>
                <div style={{ fontSize: 10, color: textSecondary }}>Nutrition Breakdown</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <GeminiBadge />
                <div
                  style={{
                    background: emerald50,
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 16,
                    fontWeight: 800,
                    color: emerald500,
                  }}
                >
                  420 kcal
                </div>
              </div>
            </div>

            {/* Macro bars */}
            {[
              { label: "Protein", value: `${Math.round(proteinWidth / 2)}g`, pct: proteinWidth, color: "#f97316" },
              { label: "Carbs", value: `${Math.round(carbsWidth / 2)}g`, pct: carbsWidth, color: "#eab308" },
              { label: "Fat", value: `${Math.round(fatWidth / 2)}g`, pct: fatWidth, color: "#ef4444" },
            ].map((m) => (
              <div key={m.label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: textSecondary, marginBottom: 3 }}>
                  <span>{m.label}</span>
                  <span style={{ fontWeight: 600 }}>{m.value}</span>
                </div>
                <div style={{ width: "100%", height: 8, borderRadius: 4, background: "#f1f5f9" }}>
                  <div
                    style={{
                      width: `${m.pct}%`,
                      height: "100%",
                      borderRadius: 4,
                      background: m.color,
                    }}
                  />
                </div>
              </div>
            ))}

            {/* Health score */}
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 10px",
                background: emerald50,
                borderRadius: 8,
              }}
            >
              <span style={{ fontSize: 14 }}>🏆</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: emerald500 }}>
                Health Score: 8.7/10 — Excellent protein-to-calorie ratio
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 2. WORKOUT COACH SCREEN ---------- */
const WorkoutCoachScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const scoreVal = interpolate(frame, [40, 100], [0, 87], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
  });

  const feedbackOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference * (1 - scoreVal / 100);

  return (
    <div style={{ background: appBg, height: "100%", fontFamily: appFont }}>
      <AppNavBar title="Workout Coach" />
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
          Workout Coach
        </div>
        <div style={{ fontSize: 10, color: textSecondary, marginBottom: 12 }}>
          Upload workout videos for AI form analysis
        </div>

        {/* Video player area */}
        <div
          style={{
            width: "100%",
            height: 130,
            borderRadius: 12,
            overflow: "hidden",
            background: "#1a1a2e",
            position: "relative",
            marginBottom: 12,
          }}
        >
          {/* Fake video content — person doing squats */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, #1e293b, #0f172a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Stick figure doing a squat */}
            <svg width={80} height={100} viewBox="0 0 80 100">
              {/* Head */}
              <circle cx={40} cy={14} r={10} fill="none" stroke="#60a5fa" strokeWidth={2} />
              {/* Body */}
              <line x1={40} y1={24} x2={40} y2={55} stroke="#60a5fa" strokeWidth={2} />
              {/* Arms */}
              <line x1={40} y1={34} x2={20} y2={48} stroke="#60a5fa" strokeWidth={2} />
              <line x1={40} y1={34} x2={60} y2={48} stroke="#60a5fa" strokeWidth={2} />
              {/* Legs (squat position) */}
              <line x1={40} y1={55} x2={25} y2={80} stroke="#60a5fa" strokeWidth={2} />
              <line x1={40} y1={55} x2={55} y2={80} stroke="#60a5fa" strokeWidth={2} />
              <line x1={25} y1={80} x2={20} y2={95} stroke="#60a5fa" strokeWidth={2} />
              <line x1={55} y1={80} x2={60} y2={95} stroke="#60a5fa" strokeWidth={2} />
              {/* Joint dots (pose detection) */}
              {[[40,14],[40,34],[20,48],[60,48],[40,55],[25,80],[55,80]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r={3} fill="#22d3ee" />
              ))}
            </svg>

            {/* Live overlay */}
            <div
              style={{
                position: "absolute",
                top: 8,
                left: 10,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444" }} />
              <span style={{ fontSize: 9, fontWeight: 700, color: "#fff" }}>LIVE</span>
              <GeminiBadge />
            </div>

            {/* Score overlay */}
            {frame >= 40 && (
              <div
                style={{
                  position: "absolute",
                  top: 8,
                  right: 10,
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: scoreVal >= 70 ? "#22c55e" : "#eab308",
                    fontFamily: fonts.heading,
                  }}
                >
                  {Math.round(scoreVal)}
                </span>
                <span style={{ fontSize: 8, color: "#94a3b8" }}>FORM</span>
              </div>
            )}

            {/* Bottom tip */}
            {frame >= 60 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 8,
                  left: 10,
                  right: 10,
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: 8,
                  padding: "4px 10px",
                }}
              >
                <span style={{ fontSize: 9, color: "#fff", fontWeight: 500 }}>
                  💡 Keep knees aligned with toes during descent
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Feedback card */}
        {frame >= 90 && (
          <div
            style={{
              opacity: feedbackOpacity,
              background: cardBg,
              borderRadius: 12,
              padding: 14,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              {/* Score circle */}
              <svg width={80} height={80} viewBox="0 0 80 80">
                <circle cx={40} cy={40} r={36} fill="none" stroke="#f1f5f9" strokeWidth={5} />
                <circle
                  cx={40} cy={40} r={36} fill="none"
                  stroke={emerald500} strokeWidth={5}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  transform="rotate(-90 40 40)"
                />
                <text x={40} y={44} textAnchor="middle" fill={textPrimary} fontSize={20} fontWeight={800} fontFamily={fonts.heading}>
                  {Math.round(scoreVal)}
                </text>
              </svg>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: textPrimary }}>
                  Barbell Squat
                </div>
                <div style={{ fontSize: 10, color: textSecondary, marginBottom: 4 }}>
                  12 reps detected
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["Good depth", "Steady tempo"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 8,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: emerald50,
                        color: emerald500,
                        fontWeight: 600,
                      }}
                    >
                      ✓ {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 3. MOOD TRACKER SCREEN (VOICE) ---------- */
const MoodTrackerScreen: React.FC = () => {
  const frame = useCurrentFrame();

  // Phase 1: Recording (0-60)
  // Phase 2: Analyzing (60-90)
  // Phase 3: Result (90+)
  const isRecording = frame >= 10 && frame < 60;
  const showResult = frame >= 95;

  const resultOpacity = interpolate(frame, [95, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ background: appBg, height: "100%", fontFamily: appFont }}>
      <AppNavBar title="Mood Tracker" />
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: textPrimary, marginBottom: 4 }}>
          Mood Tracker
        </div>
        <div style={{ fontSize: 10, color: textSecondary, marginBottom: 12 }}>
          Speak or write about how you're feeling
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: "flex",
            background: "#f1f5f9",
            borderRadius: 10,
            padding: 3,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px 0",
              borderRadius: 8,
              background: cardBg,
              fontSize: 10,
              fontWeight: 600,
              color: textPrimary,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            🎤 Voice Memo
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px 0",
              borderRadius: 8,
              fontSize: 10,
              fontWeight: 500,
              color: textMuted,
            }}
          >
            ✏️ Journal Entry
          </div>
        </div>

        {/* Recording / waveform area */}
        {!showResult && (
          <div
            style={{
              background: cardBg,
              borderRadius: 12,
              padding: 20,
              border: `1px solid ${cardBorder}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {/* Mic button */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: isRecording
                  ? "linear-gradient(135deg, #ef4444, #f87171)"
                  : "linear-gradient(135deg, #c084fc, #f472b6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: isRecording ? "0 0 0 8px rgba(239,68,68,0.15)" : "none",
              }}
            >
              <span style={{ fontSize: 20, color: "#fff" }}>🎤</span>
            </div>

            {/* Waveform bars when recording */}
            {isRecording && (
              <div style={{ display: "flex", alignItems: "center", gap: 2, height: 36 }}>
                {Array.from({ length: 24 }, (_, i) => {
                  const h = interpolate(
                    Math.sin(frame * 0.12 + i * 0.5),
                    [-1, 1],
                    [6, 32]
                  );
                  return (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: h,
                        borderRadius: 2,
                        background: "linear-gradient(180deg, #c084fc, #f472b6)",
                        opacity: 0.7,
                      }}
                    />
                  );
                })}
              </div>
            )}

            <span style={{ fontSize: 10, color: isRecording ? "#ef4444" : textMuted, fontWeight: 500 }}>
              {isRecording
                ? `Recording... 0:${String(Math.floor((frame - 10) / 30)).padStart(2, "0")}`
                : "Tap to start recording"}
            </span>
          </div>
        )}

        {/* Analyzing state */}
        {frame >= 60 && frame < 95 && (
          <div
            style={{
              textAlign: "center",
              padding: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                border: "2px solid #c084fc",
                borderTopColor: "transparent",
                borderRadius: "50%",
                transform: `rotate(${frame * 8}deg)`,
              }}
            />
            <span style={{ fontSize: 11, color: textSecondary }}>
              Analyzing your mood...
            </span>
          </div>
        )}

        {/* Mood result card */}
        {showResult && (
          <div
            style={{
              opacity: resultOpacity,
              background: cardBg,
              borderRadius: 12,
              padding: 14,
              border: `1px solid ${cardBorder}`,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: "#fef3c7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                }}
              >
                😊
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary }}>Content</div>
                <div style={{ fontSize: 10, color: textSecondary }}>
                  Mood Score: <span style={{ fontWeight: 700, color: emerald500 }}>7.2/10</span>
                </div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <GeminiBadge />
              </div>
            </div>
            <div style={{ fontSize: 10, color: textSecondary, lineHeight: 1.5, marginBottom: 8 }}>
              "You sound positive and energized today. Your tone suggests good rest and low stress levels."
            </div>
            <div
              style={{
                background: "#eef2ff",
                borderRadius: 8,
                padding: "6px 10px",
                fontSize: 9,
                color: "#6366f1",
                fontWeight: 500,
              }}
            >
              💡 Pattern: You tend to feel best on days after morning workouts
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ---------- 4. CHAT COACH SCREEN ---------- */
const ChatCoachScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const aiMessage = "Based on your recent meals and workout data, I'd suggest increasing your protein intake by 15-20g on training days. Let me check your nutrition log...";
  const charsToShow = Math.min(Math.floor(Math.max(0, frame - 40) / 0.8), aiMessage.length);

  const toolOpacity = interpolate(frame, [120, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ background: appBg, height: "100%", fontFamily: appFont, display: "flex", flexDirection: "column" }}>
      {/* Chat header — matches the real emerald gradient header */}
      <div
        style={{
          height: 46,
          background: "linear-gradient(135deg, #10b981, #14b8a6)",
          display: "flex",
          alignItems: "center",
          padding: "0 14px",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 14 }}>🤖</span>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>AI Wellness Coach</div>
          <div style={{ fontSize: 8, color: "rgba(255,255,255,0.7)" }}>
            Gemini 3 Pro + Grounding + Tools
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div style={{ flex: 1, padding: 14, display: "flex", flexDirection: "column", gap: 10, background: "#f8fafc" }}>
        {/* User message */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <div
            style={{
              maxWidth: "75%",
              padding: "8px 12px",
              borderRadius: "12px 12px 4px 12px",
              background: "linear-gradient(135deg, #10b981, #14b8a6)",
              fontSize: 10,
              color: "#fff",
              lineHeight: 1.4,
            }}
          >
            How should I adjust my diet for my workout schedule?
          </div>
        </div>

        {/* AI message — streaming */}
        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <div
            style={{
              maxWidth: "80%",
              padding: "8px 12px",
              borderRadius: "12px 12px 12px 4px",
              background: cardBg,
              border: `1px solid ${cardBorder}`,
              fontSize: 10,
              color: textPrimary,
              lineHeight: 1.5,
            }}
          >
            {frame < 40 ? (
              // Bouncing dots
              <div style={{ display: "flex", gap: 3, padding: "4px 0" }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: emerald500,
                      opacity: interpolate(
                        Math.sin(frame * 0.15 + i * 1.2),
                        [-1, 1],
                        [0.3, 1]
                      ),
                    }}
                  />
                ))}
              </div>
            ) : (
              <>
                {aiMessage.slice(0, charsToShow)}
                {charsToShow < aiMessage.length && (
                  <span style={{ color: emerald500 }}>|</span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tool call indicator */}
        {frame >= 120 && (
          <div
            style={{
              opacity: toolOpacity,
              display: "flex",
              justifyContent: "flex-start",
            }}
          >
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 10,
                background: "#eff6ff",
                border: `1px solid #bfdbfe`,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  border: "2px solid #3b82f6",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  transform: `rotate(${frame * 6}deg)`,
                }}
              />
              <span style={{ fontSize: 9, color: "#3b82f6", fontWeight: 600, fontFamily: fonts.mono }}>
                getNutritionHistory()
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div
        style={{
          height: 42,
          background: cardBg,
          borderTop: `1px solid ${cardBorder}`,
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: 8,
        }}
      >
        <div
          style={{
            flex: 1,
            height: 28,
            borderRadius: 14,
            border: `1px solid ${cardBorder}`,
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            fontSize: 9,
            color: textMuted,
          }}
        >
          Ask your wellness coach...
        </div>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #10b981, #14b8a6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#fff" }}>→</span>
        </div>
      </div>
    </div>
  );
};

/* ---------- 5. PROGRESS SCREEN (STRUCTURED OUTPUT) ---------- */
const ProgressScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const stats = [
    { emoji: "🍽️", label: "Meals", value: "24", bg: "#fff7ed" },
    { emoji: "💪", label: "Workouts", value: "12", bg: "#eff6ff" },
    { emoji: "😊", label: "Moods", value: "18", bg: "#faf5ff" },
    { emoji: "📊", label: "Avg Mood", value: "7.4", bg: emerald50 },
    { emoji: "🔥", label: "Avg Cal", value: "1,840", bg: "#fef2f2" },
    { emoji: "⭐", label: "Avg Form", value: "82", bg: "#fffbeb" },
  ];

  const insightOpacity = interpolate(frame, [60, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // JSON lines fading in sequentially
  const jsonLines = [
    '{ "weekSummary": {',
    '    "totalMeals": 24,',
    '    "avgCalories": 1840,',
    '    "proteinGoalHit": 5,',
    '    "moodTrend": "improving",',
    '    "formAvg": 82.4',
    "  }",
    "}",
  ];

  return (
    <div style={{ background: appBg, height: "100%", fontFamily: appFont }}>
      <AppNavBar title="Progress" />
      <div style={{ padding: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 10 }}>
          Progress
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 6,
            marginBottom: 10,
          }}
        >
          {stats.map((s, i) => {
            const statOpacity = interpolate(frame, [5 + i * 5, 15 + i * 5], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={s.label}
                style={{
                  opacity: statOpacity,
                  background: s.bg,
                  borderRadius: 10,
                  padding: "8px 6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 14 }}>{s.emoji}</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: textPrimary }}>{s.value}</div>
                <div style={{ fontSize: 8, color: textSecondary }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Structured JSON output overlay — the key demo point */}
        <div
          style={{
            background: "#1e1b4b",
            borderRadius: 10,
            padding: 10,
            opacity: insightOpacity,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 9, color: "#a78bfa", fontWeight: 600, fontFamily: fonts.mono }}>
              Structured JSON Response
            </span>
            <GeminiBadge />
          </div>
          {jsonLines.map((line, i) => {
            const lineOpacity = interpolate(frame, [70 + i * 6, 80 + i * 6], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return (
              <div
                key={i}
                style={{
                  opacity: lineOpacity,
                  fontSize: 9,
                  fontFamily: fonts.mono,
                  color: "#c4b5fd",
                  lineHeight: 1.6,
                  whiteSpace: "pre",
                }}
              >
                {line}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ---------- 6. DASHBOARD SCREEN (CROSS-FEATURE REASONING) ---------- */
const DashboardScreen: React.FC = () => {
  const frame = useCurrentFrame();

  const insightsOpacity = interpolate(frame, [30, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const insights = [
    { type: "positive", icon: "✅", title: "Strong protein intake", desc: "Your avg 38g/meal supports workout recovery", bg: emerald50, border: "#a7f3d0" },
    { type: "insight", icon: "💡", title: "Mood-exercise link", desc: "Mood scores are 22% higher on workout days", bg: "#eff6ff", border: "#bfdbfe" },
    { type: "attention", icon: "⚡", title: "Hydration gap", desc: "Consider tracking water on rest days", bg: "#fffbeb", border: "#fde68a" },
  ];

  return (
    <div style={{ background: appBg, height: "100%", fontFamily: appFont }}>
      <AppNavBar title="Dashboard" />
      <div style={{ padding: 12 }}>
        {/* Greeting */}
        <div style={{ fontSize: 14, fontWeight: 700, color: textPrimary, marginBottom: 2 }}>
          Good morning, Alex! 👋
        </div>
        <div style={{ fontSize: 10, color: textSecondary, marginBottom: 10 }}>
          Here's your wellness summary
        </div>

        {/* Daily tip card */}
        <div
          style={{
            background: "linear-gradient(135deg, #10b981, #14b8a6)",
            borderRadius: 12,
            padding: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>
              Daily AI Wellness Tip
            </span>
            <GeminiBadge />
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.8)", lineHeight: 1.4 }}>
            Try adding a 10-minute walk after lunch — studies show it improves afternoon mood and digestion.
          </div>
        </div>

        {/* Quick actions row */}
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {[
            { emoji: "🍽️", label: "Meal", bg: "linear-gradient(135deg, #fb923c, #fbbf24)" },
            { emoji: "💪", label: "Workout", bg: "linear-gradient(135deg, #60a5fa, #22d3ee)" },
            { emoji: "😊", label: "Mood", bg: "linear-gradient(135deg, #c084fc, #f472b6)" },
            { emoji: "💬", label: "Chat", bg: "linear-gradient(135deg, #34d399, #2dd4bf)" },
          ].map((a) => (
            <div
              key={a.label}
              style={{
                flex: 1,
                background: a.bg,
                borderRadius: 10,
                padding: "10px 0",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 16 }}>{a.emoji}</div>
              <div style={{ fontSize: 8, fontWeight: 600, color: "#fff", marginTop: 2 }}>{a.label}</div>
            </div>
          ))}
        </div>

        {/* AI Insights — the cross-feature reasoning demo */}
        <div
          style={{
            opacity: insightsOpacity,
            background: cardBg,
            borderRadius: 12,
            padding: 10,
            border: `1px solid ${cardBorder}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ fontSize: 12 }}>✨</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: textPrimary }}>AI Insights</span>
            <span
              style={{
                fontSize: 8,
                padding: "1px 6px",
                borderRadius: 4,
                background: "#818cf8",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              Pro
            </span>
            <GeminiBadge />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {insights.map((ins, i) => {
              const cardOpacity = interpolate(frame, [50 + i * 18, 70 + i * 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={i}
                  style={{
                    opacity: cardOpacity,
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    background: ins.bg,
                    borderRadius: 8,
                    padding: 8,
                    border: `1px solid ${ins.border}`,
                  }}
                >
                  <span style={{ fontSize: 12 }}>{ins.icon}</span>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: textPrimary }}>{ins.title}</div>
                    <div style={{ fontSize: 8, color: textSecondary, lineHeight: 1.3 }}>{ins.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   SCENE ASSEMBLY
   ========================================================================= */

const mockScreens: React.ReactNode[] = [
  <MealAnalyzerScreen key="meal" />,
  <WorkoutCoachScreen key="workout" />,
  <MoodTrackerScreen key="mood" />,
  <ChatCoachScreen key="chat" />,
  <ProgressScreen key="progress" />,
  <DashboardScreen key="dashboard" />,
];

const gradientColors = [
  { from: colors.vision.from, to: colors.vision.to },
  { from: colors.video.from, to: colors.video.to },
  { from: colors.audio.from, to: colors.audio.to },
  { from: colors.stream.from, to: colors.stream.to },
  { from: colors.struct.from, to: colors.struct.to },
  { from: colors.reason.from, to: colors.reason.to },
];

export const FeatureShowcaseScene: React.FC = () => {
  return (
    <div style={{ ...fullSize, overflow: "hidden" }}>
      {FEATURES.map((feature, i) => {
        const gc = gradientColors[i];

        return (
          <Sequence
            key={i}
            from={i * FEATURE_FRAMES}
            durationInFrames={FEATURE_FRAMES}
          >
            <FeatureSlide
              feature={feature}
              gc={gc}
              mockScreen={mockScreens[i]}
            />
          </Sequence>
        );
      })}
    </div>
  );
};

const FeatureSlide: React.FC<{
  feature: (typeof FEATURES)[number];
  gc: { from: string; to: string };
  mockScreen: React.ReactNode;
}> = ({ feature, gc, mockScreen }) => {
  const frame = useCurrentFrame();

  // Fade in
  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out at end
  const fadeOut = interpolate(frame, [FEATURE_FRAMES - 15, FEATURE_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ ...fullSize, opacity: fadeIn * fadeOut }}>
      <GradientBackground
        colorFrom={colors.darkBg}
        colorTo={`${gc.from}18`}
      />

      <div
        style={{
          ...fullSize,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 100px",
          gap: 60,
        }}
      >
        {/* Left side: Feature info */}
        <FeatureCard
          title={feature.title}
          description={feature.description}
          icon={feature.icon}
          colorFrom={gc.from}
          colorTo={gc.to}
          mockContent={<div />}
        />

        {/* Right side: App screen in device frame */}
        <DeviceFrame delay={8} width={520} height={380}>
          {mockScreen}
        </DeviceFrame>
      </div>
    </div>
  );
};
