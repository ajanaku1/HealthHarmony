import { useState, useRef, useCallback, useEffect } from 'react'
import { captureVideoFrame, fileToGenerativePart } from '../utils/fileToBase64'
import { LIVE_FRAME_ANALYSIS_PROMPT } from '../utils/prompts'
import { LIVE_FRAME_SCHEMA } from '../utils/schemas'
import { FLASH } from '../utils/geminiModels'

const INTERVAL_MS = 5000
const BACKOFF_MS = 10000

export default function useLiveCoaching(videoRef) {
  const [coaching, setCoaching] = useState(false)
  const [paused, setPaused] = useState(false)
  const [currentTip, setCurrentTip] = useState('')
  const [formScore, setFormScore] = useState(null)
  const [exercise, setExercise] = useState('')
  const [reps, setReps] = useState(0)
  const [bodyPosition, setBodyPosition] = useState('')
  const [elapsed, setElapsed] = useState(0)

  const intervalRef = useRef(null)
  const timerRef = useRef(null)
  const busyRef = useRef(false)
  const scoresRef = useRef([])
  const tipsRef = useRef([])
  const startTimeRef = useRef(null)
  const wakeLockRef = useRef(null)

  const analyzeFrame = useCallback(async () => {
    if (busyRef.current || !videoRef.current || paused) return
    busyRef.current = true

    try {
      const base64 = captureVideoFrame(videoRef.current, 0.6)
      const imagePart = fileToGenerativePart(base64, 'image/jpeg')

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: LIVE_FRAME_ANALYSIS_PROMPT,
          fileParts: [imagePart],
          model: FLASH,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: LIVE_FRAME_SCHEMA,
          },
        }),
      })

      if (res.status === 429) {
        // Rate limited — backoff
        clearInterval(intervalRef.current)
        setTimeout(() => {
          if (coaching && !paused) {
            intervalRef.current = setInterval(analyzeFrame, INTERVAL_MS)
          }
        }, BACKOFF_MS)
        busyRef.current = false
        return
      }

      if (!res.ok) {
        busyRef.current = false
        return
      }

      const { text } = await res.json()
      const data = JSON.parse(text)

      setExercise(data.exercise || '')
      setFormScore(data.form_score)
      setCurrentTip(data.tip || '')
      setBodyPosition(data.body_position || '')
      if (data.rep_delta > 0) {
        setReps((prev) => prev + data.rep_delta)
      }

      scoresRef.current.push(data.form_score)
      if (data.tip) tipsRef.current.push(data.tip)
    } catch {
      // Silently skip failed frames
    } finally {
      busyRef.current = false
    }
  }, [videoRef, paused, coaching])

  const startCoaching = useCallback(() => {
    setCoaching(true)
    setPaused(false)
    setReps(0)
    setFormScore(null)
    setCurrentTip('')
    setExercise('')
    setBodyPosition('')
    setElapsed(0)
    scoresRef.current = []
    tipsRef.current = []
    startTimeRef.current = Date.now()

    // Start frame analysis
    intervalRef.current = setInterval(analyzeFrame, INTERVAL_MS)
    // Immediate first analysis
    setTimeout(analyzeFrame, 1000)

    // Elapsed timer
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)

    // Screen wake lock
    if ('wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then((lock) => {
        wakeLockRef.current = lock
      }).catch(() => {})
    }
  }, [analyzeFrame])

  const pauseCoaching = useCallback(() => {
    setPaused(true)
    clearInterval(intervalRef.current)
  }, [])

  const resumeCoaching = useCallback(() => {
    setPaused(false)
    intervalRef.current = setInterval(analyzeFrame, INTERVAL_MS)
  }, [analyzeFrame])

  const stopCoaching = useCallback(() => {
    setCoaching(false)
    setPaused(false)
    clearInterval(intervalRef.current)
    clearInterval(timerRef.current)

    if (wakeLockRef.current) {
      wakeLockRef.current.release().catch(() => {})
      wakeLockRef.current = null
    }

    // Generate summary
    const scores = scoresRef.current
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length * 10) / 10
      : null

    return {
      exercise_detected: exercise || 'Workout Session',
      form_score: avgScore || 0,
      reps_counted: reps,
      form_feedback: [...new Set(tipsRef.current)].slice(0, 4),
      corrections: [...new Set(tipsRef.current)].slice(0, 3),
      injury_risk: avgScore >= 7 ? 'low' : avgScore >= 5 ? 'medium' : 'high',
      next_workout_suggestion: 'Continue practicing with focus on the form tips above.',
      encouragement: `Great ${Math.floor(elapsed / 60)}+ minute session! You completed ${reps} reps with an average form score of ${avgScore}/10.`,
      duration_seconds: elapsed,
      frames_analyzed: scores.length,
    }
  }, [exercise, reps, elapsed])

  // Auto-pause on tab visibility change
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden && coaching && !paused) {
        pauseCoaching()
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [coaching, paused, pauseCoaching])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      clearInterval(timerRef.current)
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {})
      }
    }
  }, [])

  return {
    coaching,
    paused,
    currentTip,
    formScore,
    exercise,
    reps,
    bodyPosition,
    elapsed,
    startCoaching,
    pauseCoaching,
    resumeCoaching,
    stopCoaching,
  }
}
