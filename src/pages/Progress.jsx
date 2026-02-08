import { useState, useEffect } from 'react'
import { MoodChart, CalorieChart, WorkoutChart } from '../components/WellnessChart'
import useFirestore from '../hooks/useFirestore'
import useGemini from '../hooks/useGemini'
import { WEEKLY_SUMMARY_PROMPT } from '../utils/prompts'
import { WEEKLY_SUMMARY_SCHEMA } from '../utils/schemas'
import { PRO } from '../utils/geminiModels'
import GeminiBadge from '../components/GeminiBadge'

export default function Progress() {
  const { data: meals, loading: mealsLoading } = useFirestore('meals')
  const { data: workouts, loading: workoutsLoading } = useFirestore('workouts')
  const { data: moods, loading: moodsLoading } = useFirestore('moods')
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(false)
  const { analyze } = useGemini()

  const totalMeals = meals.length
  const totalWorkouts = workouts.length
  const totalMoods = moods.length
  const avgMoodScore = moods.length > 0
    ? (moods.reduce((sum, m) => sum + (m.mood_score || 0), 0) / moods.length).toFixed(1)
    : '—'
  const avgCalories = meals.length > 0
    ? Math.round(meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0) / meals.length)
    : '—'
  const avgFormScore = workouts.length > 0
    ? (workouts.reduce((sum, w) => sum + (w.form_score || 0), 0) / workouts.length).toFixed(1)
    : '—'

  async function generateSummary() {
    setSummaryLoading(true)
    try {
      const weekAgo = Date.now() - 7 * 86400000
      const weekMeals = meals.filter((m) => new Date(m.timestamp).getTime() > weekAgo)
      const weekWorkouts = workouts.filter((w) => new Date(w.timestamp).getTime() > weekAgo)
      const weekMoods = moods.filter((m) => new Date(m.timestamp).getTime() > weekAgo)

      const data = JSON.stringify({
        meals: weekMeals.map((m) => ({ name: m.meal_name, calories: m.nutrition?.calories, score: m.health_score })),
        workouts: weekWorkouts.map((w) => ({ exercise: w.exercise_detected, form: w.form_score })),
        moods: weekMoods.map((m) => ({ category: m.mood_category, score: m.mood_score })),
      })

      const prompt = WEEKLY_SUMMARY_PROMPT.replace('{data}', data)
      const result = await analyze(prompt, [], {
        model: PRO,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: WEEKLY_SUMMARY_SCHEMA,
        },
      })
      setSummary(result)
    } catch {
      setSummary({ summary: 'Keep up the great work! Consistency is key.', highlight: 'Logging your wellness data', insight: 'Track regularly for better insights.', suggestion: 'Try to log at least one entry in each category daily.' })
    } finally {
      setSummaryLoading(false)
    }
  }

  useEffect(() => {
    if (meals.length + workouts.length + moods.length > 0) {
      generateSummary()
    }
  }, [])

  const stats = [
    { label: 'Meals Logged', value: totalMeals, icon: '🍽️', color: 'bg-orange-50 text-orange-600' },
    { label: 'Workouts', value: totalWorkouts, icon: '💪', color: 'bg-blue-50 text-blue-600' },
    { label: 'Mood Logs', value: totalMoods, icon: '😊', color: 'bg-purple-50 text-purple-600' },
    { label: 'Avg Mood', value: avgMoodScore, icon: '📊', color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Avg Calories', value: avgCalories, icon: '🔥', color: 'bg-red-50 text-red-600' },
    { label: 'Avg Form', value: avgFormScore, icon: '⭐', color: 'bg-amber-50 text-amber-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="text-gray-500 mt-1">Track your wellness journey over time</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card text-center p-4">
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* AI Weekly Summary */}
      {summary && (
        <div className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <h3 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI Weekly Insight
            <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Pro</span>
            <GeminiBadge size="sm" />
          </h3>
          {summaryLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-400 border-t-emerald-600 rounded-full animate-spin" />
              <span className="text-sm text-emerald-600">Generating your weekly summary...</span>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <p className="text-gray-700">{summary.summary}</p>
              {summary.highlight && (
                <div className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">★</span>
                  <p className="text-gray-600"><strong>Highlight:</strong> {summary.highlight}</p>
                </div>
              )}
              {summary.insight && (
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">💡</span>
                  <p className="text-gray-600"><strong>Insight:</strong> {summary.insight}</p>
                </div>
              )}
              {summary.suggestion && (
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 font-bold">→</span>
                  <p className="text-gray-600"><strong>Next week:</strong> {summary.suggestion}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <MoodChart data={moods} />
      <CalorieChart data={meals} />
      <WorkoutChart data={workouts} />

      {/* No data state */}
      {totalMeals + totalWorkouts + totalMoods === 0 && (
        <div className="card text-center py-8">
          <p className="text-gray-400">Start logging meals, workouts, and moods to see your progress charts!</p>
        </div>
      )}
    </div>
  )
}
