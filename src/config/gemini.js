import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

if (!apiKey || apiKey === 'your_key_here') {
  console.warn(
    'Gemini API key not set. Add VITE_GEMINI_API_KEY to your .env file.\n' +
    'Get a key at: https://aistudio.google.com/apikey'
  )
}

const genAI = new GoogleGenerativeAI(apiKey || '')

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview',
})

export const geminiFlash = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview',
})

export default genAI
