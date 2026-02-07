import { useState, useEffect, useRef } from 'react'
import useGeminiStream from '../hooks/useGeminiStream'
import useFirestore from '../hooks/useFirestore'
import useFirestoreDoc from '../hooks/useFirestoreDoc'
import { useAuth } from '../contexts/AuthContext'
import { useUserProfile } from '../contexts/UserProfileContext'
import { getChatSystemPrompt } from '../utils/prompts'
import GeminiBadge from '../components/GeminiBadge'

const SUGGESTIONS = [
  'How is my nutrition this week?',
  'Give me a workout suggestion',
  'How can I improve my mood?',
  'What should I eat today?',
]

export default function ChatCoach() {
  const { user } = useAuth()
  const { profile } = useUserProfile()
  const { data: meals } = useFirestore('meals')
  const { data: workouts } = useFirestore('workouts')
  const { data: moods } = useFirestore('moods')
  const { data: chatData, setData: saveChatData } = useFirestoreDoc('chat/history')
  const { streamChat, streaming, error } = useGeminiStream()

  const [messages, setMessages] = useState([])
  const [streamingText, setStreamingText] = useState('')
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const initializedRef = useRef(false)

  // Load saved messages
  useEffect(() => {
    if (chatData?.messages && !initializedRef.current) {
      setMessages(chatData.messages)
      initializedRef.current = true
    }
  }, [chatData])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  function buildContext() {
    const recentMeals = meals.slice(0, 5).map((m) => `- ${m.meal_name}: ${m.nutrition?.calories} kcal, health score ${m.health_score}/10`)
    const recentWorkouts = workouts.slice(0, 3).map((w) => `- ${w.exercise_detected}: form ${w.form_score}/10, ${w.reps_counted || '?'} reps`)
    const recentMoods = moods.slice(0, 3).map((m) => `- ${m.mood_category} (${m.mood_score}/10), energy: ${m.energy_level}`)

    return [
      recentMeals.length ? `Recent meals:\n${recentMeals.join('\n')}` : 'No recent meals logged.',
      recentWorkouts.length ? `Recent workouts:\n${recentWorkouts.join('\n')}` : 'No recent workouts logged.',
      recentMoods.length ? `Recent moods:\n${recentMoods.join('\n')}` : 'No recent moods logged.',
    ].join('\n\n')
  }

  async function handleSend(text) {
    const message = (text || input).trim()
    if (!message || streaming) return

    const userMsg = { role: 'user', content: message }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setStreamingText('')

    try {
      const context = buildContext()
      const systemPrompt = getChatSystemPrompt(context, profile)
      const history = updatedMessages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        text: m.content,
      }))

      const fullText = await streamChat(history, systemPrompt, (chunk) => {
        setStreamingText(chunk)
      })

      const assistantMsg = { role: 'assistant', content: fullText }
      const finalMessages = [...updatedMessages, assistantMsg].slice(-50)
      setMessages(finalMessages)
      setStreamingText('')
      saveChatData({ messages: finalMessages })
    } catch {
      // Error is handled by the hook
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const firstName = (user?.displayName || 'there').split(' ')[0]

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] -m-4 md:-m-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm">AI Wellness Coach</h1>
            <p className="text-white/70 text-xs">Powered by Gemini 3</p>
          </div>
        </div>
        <GeminiBadge size="sm" />
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
        {messages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Hi {firstName}! I&apos;m your wellness coach.
            </h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Ask me anything about nutrition, workouts, mood, or your overall wellness journey.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-xs bg-white border border-gray-200 rounded-full px-4 py-2 text-gray-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-br-md'
                  : 'bg-white border border-gray-100 text-gray-700 rounded-bl-md shadow-sm'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {streaming && streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap streaming-cursor">
                {streamingText}
              </p>
            </div>
          </div>
        )}

        {streaming && !streamingText && (
          <div className="flex justify-start">
            <div className="rounded-2xl rounded-bl-md px-4 py-3 bg-white border border-gray-100 shadow-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your wellness coach..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent placeholder-gray-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || streaming}
            className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
