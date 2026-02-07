import { useState, useRef, useEffect } from 'react'
import ChatMessage from '../components/ChatMessage'
import useGeminiStream from '../hooks/useGeminiStream'
import { STORAGE_KEYS } from '../utils/constants'
import { getChatSystemPrompt } from '../utils/prompts'

export default function ChatCoach() {
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
      return saved ? JSON.parse(saved) : []
    } catch { return [] }
  })
  const [input, setInput] = useState('')
  const [streamingText, setStreamingText] = useState('')
  const { streamChat, streaming, error } = useGeminiStream()
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(messages.slice(-50)))
    }
  }, [messages])

  function buildContext() {
    const meals = JSON.parse(localStorage.getItem(STORAGE_KEYS.MEALS) || '[]')
    const workouts = JSON.parse(localStorage.getItem(STORAGE_KEYS.WORKOUTS) || '[]')
    const moods = JSON.parse(localStorage.getItem(STORAGE_KEYS.MOODS) || '[]')

    const parts = []
    if (meals.length > 0) {
      const recent = meals.slice(0, 3)
      parts.push(`Recent meals: ${recent.map((m) => `${m.meal_name} (${m.nutrition?.calories} kcal, health score ${m.health_score}/10)`).join('; ')}`)
    }
    if (workouts.length > 0) {
      const recent = workouts.slice(0, 3)
      parts.push(`Recent workouts: ${recent.map((w) => `${w.exercise_detected} (form ${w.form_score}/10)`).join('; ')}`)
    }
    if (moods.length > 0) {
      const recent = moods.slice(0, 3)
      parts.push(`Recent moods: ${recent.map((m) => `${m.mood_category} (score ${m.mood_score}/10)`).join('; ')}`)
    }

    const lastWorkoutTime = workouts[0]?.timestamp
    if (lastWorkoutTime) {
      const daysSince = Math.floor((Date.now() - new Date(lastWorkoutTime).getTime()) / 86400000)
      if (daysSince >= 3) parts.push(`Note: User hasn't worked out in ${daysSince} days.`)
    }

    return parts.length > 0 ? parts.join('\n') : 'No wellness data logged yet — this is a new user.'
  }

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim() || streaming) return

    const userMsg = { role: 'user', text: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStreamingText('')

    try {
      const systemPrompt = getChatSystemPrompt(buildContext())
      const fullText = await streamChat(newMessages, systemPrompt, (text) => {
        setStreamingText(text)
      })
      setStreamingText('')
      setMessages((prev) => [...prev, { role: 'assistant', text: fullText }])
    } catch {
      setStreamingText('')
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Sorry, I had trouble responding. Please try again!' }])
    }
  }

  function clearChat() {
    setMessages([])
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY)
  }

  const showWelcome = messages.length === 0 && !streaming

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Wellness Coach</h1>
          <p className="text-gray-500 text-sm">Chat with your AI wellness assistant</p>
        </div>
        {messages.length > 0 && (
          <button onClick={clearChat} className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100">
            Clear chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {showWelcome && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4c-2.5-4.5-9-2-9 3 0 6 9 11 9 11s9-5 9-11c0-5-6.5-7.5-9-3z"/>
              </svg>
            </div>
            <h2 className="text-lg font-semibold mb-2">Hi! I&apos;m your wellness coach</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              I know about your meals, workouts, and moods. Ask me anything about your wellness journey!
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                'How am I doing this week?',
                'Suggest a healthy meal',
                'Help me plan a workout',
                'I\'m feeling stressed',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); inputRef.current?.focus() }}
                  className="text-sm px-4 py-2 bg-white border border-gray-200 rounded-full hover:bg-emerald-50 hover:border-emerald-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <ChatMessage key={i} message={msg} />
        ))}

        {streaming && streamingText && (
          <ChatMessage message={{ role: 'assistant', text: streamingText }} isStreaming />
        )}

        {streaming && !streamingText && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex-shrink-0 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4c-2.5-4.5-9-2-9 3 0 6 9 11 9 11s9-5 9-11c0-5-6.5-7.5-9-3z"/>
              </svg>
            </div>
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-3 text-sm mb-2">{error}</div>
      )}

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your wellness coach..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          disabled={streaming}
        />
        <button
          type="submit"
          disabled={!input.trim() || streaming}
          className="btn-primary px-4 py-3"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
          </svg>
        </button>
      </form>
    </div>
  )
}
