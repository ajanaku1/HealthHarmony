# Health Harmony

**AI-Powered Wellness Coach Built on Google Gemini 3**

Health Harmony is a comprehensive wellness app that leverages six distinct Gemini 3 API capabilities to deliver personalized nutrition, fitness, and mental wellness coaching — all in one beautiful interface.

## Gemini 3 Capabilities

| # | Capability | Feature | Model |
|---|-----------|---------|-------|
| 1 | **Multimodal Vision** | Meal photo analysis with nutrition estimation | Flash |
| 2 | **Video Understanding** | Workout form coaching from video frames | Flash |
| 3 | **Audio NLU** | Voice memo mood analysis with sentiment detection | Flash |
| 4 | **Streaming + Function Calling** | Real-time chat coach with tool use | Pro |
| 5 | **Structured Output** | All analyses return schema-validated JSON | Flash/Pro |
| 6 | **Cross-Feature Reasoning** | AI insights correlating meals, workouts, and mood | Pro |

**Bonus:** Live webcam workout coaching with real-time form analysis (Gemini Flash, 5-second frame analysis loop).

## Architecture

```
┌─────────────────────────────────────────┐
│          React SPA (Vite + Tailwind)    │
│  Meal │ Workout │ Mood │ Chat │ Insights│
└────────────────┬────────────────────────┘
                 │
        ┌────────┴────────┐
        │ Vercel Serverless│
        │ /api/gemini      │
        │ /api/gemini-stream│
        └───┬─────────┬───┘
            │         │
   ┌────────┴──┐  ┌───┴────────┐
   │ Gemini 3  │  │  Firebase  │
   │ Pro+Flash │  │ Auth + DB  │
   └───────────┘  └────────────┘
```

## Getting Started

### Prerequisites
- Node.js 18+
- A [Gemini API key](https://aistudio.google.com/apikey)
- A Firebase project (Auth + Firestore enabled)

### Setup

```bash
git clone <repo-url>
cd HealthHarmony
npm install
```

Create a `.env` file:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_key
```

```bash
npm run dev
```

### Demo Mode

Click "Try Demo" on the landing page to explore all features with sample data — no sign-up required.

## Tech Stack

- **Frontend:** React 18 + Vite + Tailwind CSS
- **AI:** Google Gemini 3 API (Pro + Flash)
- **Backend:** Vercel Serverless Functions
- **Database:** Firebase Firestore (real-time sync)
- **Auth:** Firebase Auth (email, Google, anonymous)
- **Charts:** Recharts
- **PWA:** vite-plugin-pwa

## Features

- **Meal Analyzer** — Snap a photo, get instant AI nutrition breakdown with structured JSON output
- **Workout Coach** — Upload video or use live webcam for real-time AI form coaching
- **Mood Tracker** — Journal or voice memo analyzed for emotional state via audio NLU
- **Chat Coach** — Streaming AI chat with function calling to query your wellness data
- **AI Insights** — Cross-feature pattern detection using Gemini Pro
- **Progress Dashboard** — Charts, streaks, and AI weekly summaries
- **Guest Mode** — Full demo with seeded data, zero signup friction

## Submission Description

Health Harmony is an AI wellness coach that showcases six Gemini 3 capabilities in a single production-ready app. Users photograph meals for instant nutrition analysis (multimodal vision + structured output), record workout videos or use live webcam coaching for real-time form feedback (video understanding), log moods via voice or text (audio NLU), and chat with a streaming AI coach that uses function calling to query their actual wellness data. Gemini Pro performs cross-feature reasoning to surface correlations between diet, exercise, and mood. Every AI response uses structured JSON schemas for reliability. A zero-friction demo mode makes the full experience explorable in seconds.
