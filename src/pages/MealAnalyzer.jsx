import { useState } from 'react'
import FileUpload from '../components/FileUpload'
import NutritionCard from '../components/NutritionCard'
import useGemini from '../hooks/useGemini'
import useFirestore from '../hooks/useFirestore'
import { MEAL_ANALYSIS_PROMPT } from '../utils/prompts'
import { MEAL_SCHEMA } from '../utils/schemas'
import { FLASH } from '../utils/geminiModels'
import { fileToBase64, fileToGenerativePart } from '../utils/fileToBase64'

export default function MealAnalyzer() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const { analyze, loading, error } = useGemini()
  const { data: meals, addItem } = useFirestore('meals')

  async function handleAnalyze() {
    if (!file) return
    try {
      const base64 = await fileToBase64(file)
      const imagePart = fileToGenerativePart(base64, file.type)
      const data = await analyze(MEAL_ANALYSIS_PROMPT, [imagePart], {
        model: FLASH,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: MEAL_SCHEMA,
        },
      })
      setResult(data)
      if (data && typeof data === 'object') {
        addItem(data)
      }
    } catch (err) {
      console.error('Meal analysis failed:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Meal Analyzer</h1>
        <p className="text-gray-500 mt-1">Upload a photo of your meal for instant AI nutrition analysis</p>
      </div>

      <FileUpload
        accept="image/*"
        onFile={setFile}
        label="Drop a meal photo or click to upload"
        icon={
          <div className="text-4xl">📸</div>
        }
      />

      {file && !result && (
        <button onClick={handleAnalyze} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Analyzing your meal...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Analyze with Gemini
            </>
          )}
        </button>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <NutritionCard data={result} />
          <button
            onClick={() => { setResult(null); setFile(null) }}
            className="btn-secondary w-full"
          >
            Analyze Another Meal
          </button>
        </div>
      )}

      {/* History */}
      {meals.length > 0 && !result && (
        <div>
          <h2 className="font-semibold text-gray-700 mb-3">Recent Meals</h2>
          <div className="space-y-2">
            {meals.slice(0, 5).map((meal) => (
              <div key={meal.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-medium">{meal.meal_name}</p>
                  <p className="text-xs text-gray-400">{new Date(meal.timestamp).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{meal.nutrition?.calories} kcal</p>
                  <p className="text-xs text-gray-400">Score: {meal.health_score}/10</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
