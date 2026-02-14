import { useState } from 'react'
import useWebcam from '../hooks/useWebcam'
import useLiveCoaching from '../hooks/useLiveCoaching'
import LiveCoachingOverlay from './LiveCoachingOverlay'
import GeminiBadge from './GeminiBadge'

export default function LiveCoachingSession({ onSessionEnd }) {
  const { videoRef, active: webcamActive, error: webcamError, start, stop: stopWebcam, toggleCamera, facingMode } = useWebcam()
  const {
    coaching, paused, currentTip, formScore, exercise, reps, bodyPosition, elapsed,
    startCoaching, pauseCoaching, resumeCoaching, stopCoaching,
  } = useLiveCoaching(videoRef)
  const [phase, setPhase] = useState('setup') // 'setup' | 'active' | 'summary'

  async function handleStart() {
    await start()
    startCoaching()
    setPhase('active')
  }

  function handleStop() {
    const summary = stopCoaching()
    stopWebcam()
    setPhase('summary')
    if (onSessionEnd) onSessionEnd(summary)
  }

  function handlePauseResume() {
    if (paused) {
      resumeCoaching()
    } else {
      pauseCoaching()
    }
  }

  if (phase === 'setup') {
    return (
      <div className="card text-center py-10 space-y-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center mx-auto">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Live Workout Coaching</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Position your camera to see your full body. Gemini AI will analyze your form in real-time every 5 seconds.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <GeminiBadge />
          <span className="text-xs text-gray-400">Real-time Vision Analysis</span>
        </div>

        <div className="space-y-2 text-left max-w-xs mx-auto">
          {[
            'Position camera to capture full body',
            'Good lighting improves accuracy',
            'Start your exercise when ready',
          ].map((tip, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xs font-bold flex-shrink-0">
                {i + 1}
              </span>
              {tip}
            </div>
          ))}
        </div>

        {webcamError && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">
            {webcamError}
          </div>
        )}

        <button
          onClick={handleStart}
          className="btn-primary text-base px-8 py-3 mx-auto inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Start Live Session
        </button>
      </div>
    )
  }

  if (phase === 'active') {
    return (
      <div className="space-y-4">
        {/* Video container */}
        <div className="relative bg-black rounded-xl overflow-hidden aspect-[4/3]">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
          />
          <LiveCoachingOverlay
            formScore={formScore}
            reps={reps}
            exercise={exercise}
            currentTip={currentTip}
            bodyPosition={bodyPosition}
            elapsed={elapsed}
          />

          {/* Paused overlay */}
          {paused && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center">
                <p className="text-white text-lg font-semibold">Paused</p>
                <p className="text-white/60 text-sm">Tap resume to continue</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={toggleCamera}
            aria-label="Switch camera"
            className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>

          <button
            onClick={handlePauseResume}
            aria-label={paused ? 'Resume coaching' : 'Pause coaching'}
            className="w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-lg flex items-center justify-center transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
          >
            {paused ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleStop}
            aria-label="Stop coaching session"
            className="w-14 h-14 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-colors active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h12v12H6z" />
            </svg>
          </button>
        </div>

        {webcamError && (
          <div className="bg-red-50 text-red-600 rounded-lg p-3 text-sm">
            {webcamError}
          </div>
        )}
      </div>
    )
  }

  return null
}
