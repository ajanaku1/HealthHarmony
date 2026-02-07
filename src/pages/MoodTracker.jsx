import { useState } from 'react'
import AudioRecorder from '../components/AudioRecorder'
import MoodCard from '../components/MoodCard'
import useGemini from '../hooks/useGemini'
import useFirestore from '../hooks/useFirestore'
import { MOOD_CATEGORIES } from '../utils/constants'
import { MOOD_ANALYSIS_PROMPT, MOOD_TEXT_PROMPT } from '../utils/prompts'
import { fileToBase64, fileToGenerativePart } from '../utils/fileToBase64'

export default function MoodTracker() {
  const [mode, setMode] = useState('voice') // 'voice' | 'text'
  const [audioBlob, setAudioBlob] = useState(null)
  const [journalText, setJournalText] = useState('')
  const [result, setResult] = useState(null)
  const { analyze, loading, error } = useGemini()
  const { data: moods, addItem } = useFirestore('moods')

  async function handleAnalyze() {
    try {
      let data
      if (mode === 'voice' && audioBlob) {
        const base64 = await fileToBase64(audioBlob)
        const audioPart = fileToGenerativePart(base64, 'audio/webm')
        data = await analyze(MOOD_ANALYSIS_PROMPT, [audioPart])
      } else if (mode === 'text' && journalText.trim()) {
        const prompt = MOOD_TEXT_PROMPT.replace('{text}', journalText)
        data = await analyze(prompt)
      } else {
        return
      }

      // Add pattern detection context
      if (data && typeof data === 'object' && moods.length >= 3) {
        const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' })
        const sameDayMoods = moods.filter((m) => {
          return new Date(m.timestamp).toLocaleDateString('en-US', { weekday: 'long' }) === dayOfWeek
        })
        if (sameDayMoods.length >= 2) {
          const avgScore = sameDayMoods.reduce((sum, m) => sum + (m.mood_score || 5), 0) / sameDayMoods.length
          if (Math.abs((data.mood_score || 5) - avgScore) < 2) {
            data.pattern_note = `You tend to feel ${avgScore >= 7 ? 'good' : avgScore >= 5 ? 'okay' : 'low'} on ${dayOfWeek}s (avg: ${avgScore.toFixed(1)}/10).`
          }
        }
      }

      setResult(data)
      if (data && typeof data === 'object') {
        addItem(data)
      }
    } catch (err) {
      console.error('Mood analysis failed:', err)
    }
  }

  const canAnalyze = (mode === 'voice' && audioBlob) || (mode === 'text' && journalText.trim())

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mood Tracker</h1>
        <p className="text-gray-500 mt-1">Record a voice memo or write a journal entry for AI mood analysis</p>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setMode('voice')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'voice' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          🎤 Voice Memo
        </button>
        <button
          onClick={() => setMode('text')}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            mode === 'text' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
          }`}
        >
          ✏️ Journal Entry
        </button>
      </div>

      {/* Input */}
      {mode === 'voice' ? (
        <AudioRecorder onRecording={setAudioBlob} />
      ) : (
        <textarea
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="How are you feeling today? What's on your mind?"
          className="w-full h-40 p-4 border border-gray-200 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      )}

      {/* Analyze button */}
      {canAnalyze && !result && (
        <button onClick={handleAnalyze} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analyzing your mood...
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

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">{error}</div>
      )}

      {result && (
        <div className="space-y-4">
          <MoodCard data={result} />
          {result.pattern_note && (
            <div className="bg-indigo-50 rounded-xl p-4">
              <h4 className="text-sm font-medium text-indigo-700 mb-1">Pattern Detected</h4>
              <p className="text-sm text-indigo-600">{result.pattern_note}</p>
            </div>
          )}
          <button
            onClick={() => { setResult(null); setAudioBlob(null); setJournalText('') }}
            className="btn-secondary w-full"
          >
            Log Another Mood
          </button>
        </div>
      )}

      {/* History */}
      {moods.length > 0 && !result && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Mood History</h2>
          <div className="space-y-2">
            {moods.slice(0, 7).map((mood) => {
              const info = MOOD_CATEGORIES[mood.mood_category] || MOOD_CATEGORIES.okay
              return (
                <div key={mood.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{info.emoji}</span>
                    <div>
                      <p className="text-sm font-medium">{info.label}</p>
                      <p className="text-xs text-gray-400">{new Date(mood.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold" style={{ color: info.color }}>{mood.mood_score}/10</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
