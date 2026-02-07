import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { history, systemPrompt, model } = req.body

    const geminiModel = genAI.getGenerativeModel({
      model: model || 'gemini-3-flash-preview',
    })

    const chat = geminiModel.startChat({
      history: (history || []).slice(0, -1).map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      })),
      systemInstruction: systemPrompt,
    })

    const lastUserMsg = history?.[history.length - 1]?.text || ''

    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')

    const result = await chat.sendMessageStream(lastUserMsg)

    for await (const chunk of result.stream) {
      const text = chunk.text()
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()
  } catch (err) {
    console.error('Gemini stream error:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: err.message || 'Streaming failed' })
    } else {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
      res.end()
    }
  }
}
