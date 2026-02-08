import { useState } from 'react'

export default function useGemini() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function analyze(prompt, fileParts = [], options = {}) {
    setLoading(true)
    setError(null)
    try {
      const body = { prompt, fileParts }
      if (options.model) body.model = options.model
      if (options.tools) body.tools = options.tools
      if (options.generationConfig) body.generationConfig = options.generationConfig

      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        let message = 'API request failed'
        try {
          const err = await res.json()
          message = err.error || message
        } catch {
          const text = await res.text().catch(() => '')
          if (res.status === 413 || text.includes('Request Entity Too Large')) {
            message = 'File is too large. Please use a shorter video or a smaller file.'
          } else {
            message = text || `Request failed (${res.status})`
          }
        }
        throw new Error(message)
      }

      const json = await res.json()
      const { text, groundingMetadata } = json

      // If structured output was requested, the response is already JSON
      const isStructured = options.generationConfig?.responseMimeType === 'application/json'

      let parsed
      if (isStructured) {
        try {
          parsed = JSON.parse(text)
        } catch {
          parsed = text
        }
      } else {
        try {
          const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
          parsed = JSON.parse(cleaned)
        } catch {
          parsed = text
        }
      }

      if (groundingMetadata) {
        return { data: parsed, groundingMetadata }
      }
      return parsed
    } catch (err) {
      const message = err.message || 'Failed to analyze. Please try again.'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { analyze, loading, error }
}
