import { useState, useRef, useCallback } from 'react'
import { geminiFlash } from '../config/gemini'

export default function useGeminiStream() {
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState(null)
  const abortRef = useRef(false)

  const streamChat = useCallback(async (history, systemPrompt, onChunk) => {
    setStreaming(true)
    setError(null)
    abortRef.current = false

    try {
      const chat = geminiFlash.startChat({
        history: history.map((msg) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        })),
        systemInstruction: systemPrompt,
      })

      const lastUserMsg = history[history.length - 1]?.text || ''
      const result = await chat.sendMessageStream(lastUserMsg)

      let fullText = ''
      for await (const chunk of result.stream) {
        if (abortRef.current) break
        const text = chunk.text()
        fullText += text
        onChunk(fullText)
      }
      return fullText
    } catch (err) {
      setError(err.message || 'Chat failed. Please try again.')
      throw err
    } finally {
      setStreaming(false)
    }
  }, [])

  const abort = useCallback(() => {
    abortRef.current = true
  }, [])

  return { streamChat, streaming, error, abort }
}
