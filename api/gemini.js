import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { prompt, fileParts, model } = req.body

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    const geminiModel = genAI.getGenerativeModel({
      model: model || 'gemini-3-flash-preview',
    })

    const parts = [...(fileParts || []), { text: prompt }]
    const result = await geminiModel.generateContent(parts)
    const text = result.response.text()

    res.status(200).json({ text })
  } catch (err) {
    console.error('Gemini API error:', err)
    const msg = err.message || ''
    if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
      return res.status(429).json({ error: 'AI is a bit busy right now. Please wait a moment and try again.' })
    }
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}
