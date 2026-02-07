import { useState, useEffect } from 'react'
import useGemini from '../hooks/useGemini'
import { CROSS_FEATURE_INSIGHTS_PROMPT } from '../utils/prompts'
import { useAuth } from '../contexts/AuthContext'
import GeminiBadge from './GeminiBadge'

const typeConfig = {
  positive: { icon: '✅', bg: 'bg-emerald-50', border: 'border-emerald-100', iconBg: 'bg-emerald-100' },
  neutral: { icon: '💡', bg: 'bg-blue-50', border: 'border-blue-100', iconBg: 'bg-blue-100' },
  attention: { icon: '⚡', bg: 'bg-amber-50', border: 'border-amber-100', iconBg: 'bg-amber-100' },
}

export default function AIInsights({ meals, workouts, moods }) {
  const { user } = useAuth()
  const { analyze } = useGemini()
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(false)

  const totalCount = (meals?.length || 0) + (workouts?.length || 0) + (moods?.length || 0)

  useEffect(() => {
    if (totalCount < 3 || !user) return

    const cacheKey = `hh_insights_${user.uid}`
    const today = new Date().toDateString()
    const cached = localStorage.getItem(cacheKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed.date === today) {
          setInsights(parsed.insights)
          return
        }
      } catch {}
    }

    async function fetchInsights() {
      setLoading(true)
      try {
        const twoWeeksAgo = Date.now() - 14 * 86400000
        const filter = (arr) => (arr || []).filter((i) => new Date(i.timestamp).getTime() > twoWeeksAgo)

        const data = JSON.stringify({
          meals: filter(meals).map((m) => ({ name: m.meal_name, calories: m.nutrition?.calories, health_score: m.health_score, date: m.timestamp })),
          workouts: filter(workouts).map((w) => ({ exercise: w.exercise_detected, form_score: w.form_score, reps: w.reps_counted, date: w.timestamp })),
          moods: filter(moods).map((m) => ({ category: m.mood_category, score: m.mood_score, energy: m.energy_level, date: m.timestamp })),
        })

        const prompt = CROSS_FEATURE_INSIGHTS_PROMPT.replace('{data}', data)
        const result = await analyze(prompt)
        const arr = Array.isArray(result) ? result : []
        setInsights(arr)
        localStorage.setItem(cacheKey, JSON.stringify({ date: today, insights: arr }))
      } catch {
        setInsights(null)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [totalCount, user])

  if (totalCount < 3 && !loading) return null

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        <h2 className="font-semibold text-gray-700">AI Insights</h2>
        <GeminiBadge size="sm" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-6 gap-2">
          <div className="w-4 h-4 border-2 border-emerald-400 border-t-emerald-600 rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Analyzing your wellness patterns...</span>
        </div>
      ) : insights && insights.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {insights.map((insight, i) => {
            const config = typeConfig[insight.type] || typeConfig.neutral
            return (
              <div key={i} className={`rounded-xl p-4 border ${config.bg} ${config.border}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0 text-sm`}>
                    {config.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
