export const FPS = 30;
export const TOTAL_DURATION_SEC = 75;
export const TOTAL_FRAMES = FPS * TOTAL_DURATION_SEC; // 2250

// Scene durations in seconds
export const TITLE_DURATION_SEC = 12;
export const FEATURE_SHOWCASE_DURATION_SEC = 36;
export const ARCHITECTURE_DURATION_SEC = 15;
export const CLOSING_DURATION_SEC = 12;

// Scene durations in frames
export const TITLE_FRAMES = TITLE_DURATION_SEC * FPS; // 360
export const FEATURE_SHOWCASE_FRAMES = FEATURE_SHOWCASE_DURATION_SEC * FPS; // 1080
export const ARCHITECTURE_FRAMES = ARCHITECTURE_DURATION_SEC * FPS; // 450
export const CLOSING_FRAMES = CLOSING_DURATION_SEC * FPS; // 360

// Feature sub-scene duration
export const FEATURE_DURATION_SEC = 6;
export const FEATURE_FRAMES = FEATURE_DURATION_SEC * FPS; // 180

// Features list
export const FEATURES = [
  {
    title: "Multimodal Vision",
    description: "Snap a photo of any meal for instant AI nutritional analysis",
    icon: "eye",
  },
  {
    title: "Video Understanding",
    description: "Upload workout videos for real-time form scoring and feedback",
    icon: "video",
  },
  {
    title: "Audio NLU",
    description: "Speak naturally to log meals, moods, and workouts hands-free",
    icon: "audio",
  },
  {
    title: "Streaming + Function Calling",
    description: "Real-time AI coaching with live tool execution",
    icon: "stream",
  },
  {
    title: "Structured Output",
    description: "Type-safe JSON responses for reliable data integration",
    icon: "struct",
  },
  {
    title: "Cross-Feature Reasoning",
    description: "Holistic insights connecting nutrition, fitness, and mood data",
    icon: "reason",
  },
] as const;

export type FeatureIcon = (typeof FEATURES)[number]["icon"];
