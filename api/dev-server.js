import 'dotenv/config'
import express from 'express'
import geminiHandler from './gemini.js'
import geminiStreamHandler from './gemini-stream.js'

const app = express()
app.use(express.json({ limit: '10mb' }))

app.post('/api/gemini', geminiHandler)
app.post('/api/gemini-stream', geminiStreamHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`API dev server running on http://localhost:${PORT}`)
  console.log(`GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '***configured***' : 'MISSING'}`)
})
