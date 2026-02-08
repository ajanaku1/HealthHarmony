# Health Harmony — Demo Script (3 minutes)

## 0:00–0:15 — Hook

> "What if your phone could be your nutritionist, personal trainer, and therapist — all powered by one AI? Meet Health Harmony, built entirely on Google Gemini 3, using six distinct API capabilities."

## 0:15–0:30 — Zero-Friction Demo Mode

> "No sign-up needed. One click on 'Try Demo' and you're in with sample data pre-loaded."

**Actions:**
- Show landing page with "Built on Gemini 3" badge and 6 capabilities grid
- Click "Try Demo" — instant anonymous auth → dashboard

## 0:30–1:00 — Meal Analyzer (Vision + Structured Output)

> "Snap a photo of any meal. Gemini Flash analyzes the image and returns structured JSON — calories, macros, health score, and healthier alternatives. No prompt hacking needed — the API's structured output schema guarantees valid data every time."

**Actions:**
- Upload meal photo
- Show loading → NutritionCard result
- Highlight: schema-enforced JSON, no markdown fences

## 1:00–1:40 — Live Webcam Workout Coach (Real-Time Vision)

> "This is the feature that changes everything. Turn on your webcam and Gemini analyzes your form in real-time — every 5 seconds, a frame goes to Gemini Flash with structured output. You get a live form score, rep counter, and correction tips overlaid on the video feed."

**Actions:**
- Navigate to Workout Coach → switch to "Live Mode"
- Click "Start Live Session" → camera activates
- Do 3-4 squats → show form score updating, reps incrementing, tips appearing
- Hit stop → show workout summary (reuses same WorkoutFeedback component)
- Emphasize: adaptive backoff on rate limits, wake lock prevents screen dimming

## 1:40–2:00 — Mood Tracker (Audio NLU + Text Analysis)

> "Record a voice memo or type a journal entry. Gemini analyzes audio for emotional state — mood score, energy level, detected emotions — with structured JSON output."

**Actions:**
- Show pre-analyzed mood result
- Highlight: dual modality (voice + text), pattern detection across days

## 2:00–2:30 — Chat Coach (Pro + Streaming + Function Calling + Grounding)

> "Our chat coach runs on Gemini Pro with three advanced features. First, streaming — responses appear word by word. Second, function calling — when you ask about your nutrition, the model calls a tool to fetch your actual meal data, and you can see the tool call indicator in real-time. Third, Google Search grounding — for questions about general health topics, sources are cited below the response."

**Actions:**
- Navigate to Chat Coach
- Click "How is my nutrition this week?"
- Show tool call indicator: "Looking up recent meals..."
- Show streaming response referencing actual logged data
- Show grounding sources if present

## 2:30–2:50 — AI Insights (Pro + Cross-Feature Reasoning)

> "Gemini Pro analyzes 14 days of combined data across meals, workouts, and mood to find patterns you'd never spot yourself — like 'your mood is higher on days you exercise' or 'high-calorie meals correlate with low energy the next day.' All returned as structured JSON."

**Actions:**
- Show Dashboard → AI Insights section with insight cards
- Highlight the "Pro" badge indicating model upgrade

## 2:50–3:00 — Closing Recap

> "That's six Gemini 3 capabilities in one app: multimodal vision, video understanding, audio NLU, streaming with function calling, structured output, and cross-feature reasoning. Plus live webcam coaching that feels like magic. Try it now — no sign-up required."

**Actions:**
- Quick montage of Gemini badges on each feature
- End on landing page with URL
