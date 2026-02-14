import { useState, useRef } from 'react'

export default function AudioRecorder({ onRecording }) {
  const [recording, setRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState(null)
  const mediaRecorder = useRef(null)
  const chunks = useRef([])
  const timer = useRef(null)

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream, { mimeType: 'audio/webm' })
      chunks.current = []

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data)
      }

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        onRecording(blob)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.current.start()
      setRecording(true)
      setDuration(0)
      timer.current = setInterval(() => setDuration((d) => d + 1), 1000)
    } catch (err) {
      console.error('Microphone access denied:', err)
    }
  }

  function stopRecording() {
    mediaRecorder.current?.stop()
    setRecording(false)
    clearInterval(timer.current)
  }

  function reset() {
    setAudioUrl(null)
    setDuration(0)
    onRecording(null)
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {!recording && !audioUrl && (
          <button onClick={startRecording} className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
              <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
            </svg>
            Record Voice Memo
          </button>
        )}

        {recording && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-600 font-medium">{formatTime(duration)}</span>
            </div>
            <button onClick={stopRecording} className="btn-primary bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 active:scale-[0.97]">
              Stop Recording
            </button>
          </div>
        )}

        {audioUrl && !recording && (
          <div className="flex items-center gap-3 flex-1">
            <audio src={audioUrl} controls className="flex-1 h-10" />
            <button onClick={reset} className="btn-secondary text-sm px-4 py-2">
              Re-record
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
