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
      systemInstruction: { parts: [{ text: systemPrompt }] },
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
    const msg = err.message || ''
    let friendly
    if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
      friendly = 'AI is a bit busy right now. Please wait a moment and try again.'
    } else if (msg.includes('API_KEY') || msg.includes('apiKey')) {
      friendly = 'API key configuration issue. Please check GEMINI_API_KEY.'
    } else if (msg.includes('not found') || msg.includes('404')) {
      friendly = 'AI model not available. Please check the model name.'
    } else {
      friendly = msg || 'Something went wrong. Please try again.'
    }
    if (!res.headersSent) {
      res.status(msg.includes('429') ? 429 : 500).json({ error: friendly })
    } else {
      res.write(`data: ${JSON.stringify({ error: friendly })}\n\n`)
      res.end()
    }
  }
}
