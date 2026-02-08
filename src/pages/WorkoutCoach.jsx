import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import WorkoutFeedback from '../components/WorkoutFeedback'
import LiveCoachingSession from '../components/LiveCoachingSession'
import useGemini from '../hooks/useGemini'
import useFirestore from '../hooks/useFirestore'
import { WORKOUT_ANALYSIS_PROMPT } from '../utils/prompts'
import { WORKOUT_SCHEMA } from '../utils/schemas'
import { FLASH } from '../utils/geminiModels'
import { fileToBase64, fileToGenerativePart, extractVideoFrames } from '../utils/fileToBase64'

export default function WorkoutCoach() {
  const [mode, setMode] = useState('upload') // 'upload' | 'live'
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const { analyze, loading, error } = useGemini()
  const { data: workouts, addItem } = useFirestore('workouts')

  async function handleAnalyze() {
    if (!file) return
    try {
      const frames = await extractVideoFrames(file, 4)
      const frameParts = frames.map((b64) => fileToGenerativePart(b64, 'image/jpeg'))

      const prevContext = workouts.length > 0
        ? `\n\nPrevious session: ${workouts[0].exercise_detected}, form score: ${workouts[0].form_score}/10. Compare and note improvement.`
        : ''

      const data = await analyze(
        WORKOUT_ANALYSIS_PROMPT + '\n\nThese are frames extracted from the workout video at different timestamps. Analyze the exercise form across these frames.' + prevContext,
        frameParts,
        {
          model: FLASH,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: WORKOUT_SCHEMA,
          },
        }
      )
      setResult(data)
      if (data && typeof data === 'object') {
        addItem(data)
      }
    } catch (err) {
      console.error('Workout analysis failed:', err)
    }
  }

  function handleLiveSessionEnd(summary) {
    if (summary && typeof summary === 'object') {
      addItem(summary)
    }
    setResult(summary)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Workout Coach</h1>
        <p className="text-gray-500 mt-1">Get AI form analysis from video upload or live webcam coaching</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => { setMode('upload'); setResult(null) }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Upload Video
        </button>
        <button
          onClick={() => { setMode('live'); setResult(null); setFile(null) }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'live' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          Live Mode
        </button>
      </div>

      {mode === 'live' ? (
        <LiveCoachingSession onSessionEnd={handleLiveSessionEnd} />
      ) : (
        <>
          <FileUpload
            accept="video/*"
            onFile={setFile}
            label="Drop a workout video or click to upload"
            icon={<div className="text-4xl">🏋️</div>}
          />

          {file && !result && (
            <button onClick={handleAnalyze} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Analyzing your form...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                  Analyze with Gemini
                </>
              )}
            </button>
          )}
        </>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <WorkoutFeedback data={result} />
          <button
            onClick={() => { setResult(null); setFile(null) }}
            className="btn-secondary w-full"
          >
            {mode === 'live' ? 'Start New Session' : 'Analyze Another Workout'}
          </button>
        </div>
      )}

      {/* History */}
      {workouts.length > 0 && !result && mode === 'upload' && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Recent Workouts</h2>
          <div className="space-y-2">
            {workouts.slice(0, 5).map((w) => (
              <div key={w.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-medium">{w.exercise_detected}</p>
                  <p className="text-xs text-gray-400">{new Date(w.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{w.form_score}/10</p>
                  <p className="text-xs text-gray-400">{w.reps_counted ? `${w.reps_counted} reps` : ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
