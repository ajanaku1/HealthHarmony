import { useState } from 'react'

export default function useGemini() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function analyze(prompt, fileParts = []) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, fileParts }),
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

      const { text } = await res.json()
      // Try to parse as JSON, fall back to raw text
      try {
        const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        return JSON.parse(cleaned)
      } catch {
        return text
      }
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
