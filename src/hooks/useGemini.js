import { useState } from 'react'
import { geminiModel } from '../config/gemini'

export default function useGemini() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function analyze(prompt, fileParts = []) {
    setLoading(true)
    setError(null)
    try {
      const parts = [...fileParts, { text: prompt }]
      const result = await geminiModel.generateContent(parts)
      const text = result.response.text()
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
