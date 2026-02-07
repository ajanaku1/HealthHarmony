import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useFirestore from '../hooks/useFirestore'
import useGemini from '../hooks/useGemini'
import { MOOD_CATEGORIES } from '../utils/constants'
import { DAILY_TIP_PROMPT } from '../utils/prompts'
import { useAuth } from '../contexts/AuthContext'
import { useUserProfile } from '../contexts/UserProfileContext'
import StreakCalendar from '../components/StreakCalendar'

export default function Dashboard() {
  const { user } = useAuth()
  const { profile } = useUserProfile()
  const { data: meals, loading: mealsLoading } = useFirestore('meals')
  const { data: workouts, loading: workoutsLoading } = useFirestore('workouts')
  const { data: moods, loading: moodsLoading } = useFirestore('moods')
  const [tip, setTip] = useState('')
  const [tipLoading, setTipLoading] = useState(false)
  const { analyze } = useGemini()

  const firstName = (user?.displayName || 'there').split(' ')[0]

  const latestMeal = meals[0]
  const latestWorkout = workouts[0]
  const latestMood = moods[0]

  // Calculate streaks
  const today = new Date().toDateString()
  const hasLoggedToday = [
    meals.find((m) => new Date(m.timestamp).toDateString() === today),
    workouts.find((w) => new Date(w.timestamp).toDateString() === today),
    moods.find((m) => new Date(m.timestamp).toDateString() === today),
  ].filter(Boolean).length

  const dataLoading = mealsLoading || workoutsLoading || moodsLoading

  useEffect(() => {
    if (dataLoading || !user) return

    const tipKey = `hh_daily_tip_${user.uid}`
    const cached = localStorage.getItem(tipKey)
    if (cached) {
      try {
        const parsed = JSON.parse(cached)
        if (parsed.date === today) {
          setTip(parsed.tip)
          return
        }
      } catch {}
    }

    async function fetchTip() {
      setTipLoading(true)
      try {
        const profileContext = profile ? `User goals: ${(profile.fitnessGoals || []).join(', ')}. Fitness level: ${profile.fitnessLevel || 'unknown'}. Diet: ${(profile.dietaryPreferences || []).join(', ') || 'none'}.` : ''
        const context = `Meals logged: ${meals.length}, Workouts: ${workouts.length}, Moods: ${moods.length}. Latest mood: ${latestMood?.mood_category || 'none'}. Latest meal calories: ${latestMeal?.nutrition?.calories || 'none'}. ${profileContext}`
        const prompt = DAILY_TIP_PROMPT.replace('{context}', context)
        const result = await analyze(prompt)
        const tipText = typeof result === 'string' ? result : result.tip || 'Stay hydrated and take breaks!'
        setTip(tipText)
        localStorage.setItem(tipKey, JSON.stringify({ date: today, tip: tipText }))
      } catch {
        setTip('Stay hydrated, move your body, and take moments to breathe today!')
      } finally {
        setTipLoading(false)
      }
    }
    fetchTip()
  }, [dataLoading, user])

  const quickActions = [
    { path: '/meals', label: 'Log Meal', icon: '🍽️', color: 'from-orange-400 to-amber-400' },
    { path: '/workout', label: 'Log Workout', icon: '💪', color: 'from-blue-400 to-cyan-400' },
    { path: '/mood', label: 'Log Mood', icon: '😊', color: 'from-purple-400 to-pink-400' },
    { path: '/chat', label: 'Chat Coach', icon: '💬', color: 'from-emerald-400 to-teal-400' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {firstName}!
        </h1>
        <p className="text-gray-500 mt-1">Here&apos;s your wellness snapshot</p>
      </div>

      {/* Daily AI Tip */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white/80 mb-1">Daily AI Wellness Tip</h3>
            {tipLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span className="text-sm text-white/70">Generating your personalized tip...</span>
              </div>
            ) : (
              <p className="text-sm leading-relaxed">{tip}</p>
            )}
          </div>
        </div>
      </div>

      {/* Today's Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Today&apos;s Check-in</h2>
          <span className="text-xs text-gray-400">{hasLoggedToday}/3 logged</span>
        </div>
        <div className="flex gap-3">
          {[
            { label: 'Meal', done: meals.some((m) => new Date(m.timestamp).toDateString() === today), path: '/meals' },
            { label: 'Workout', done: workouts.some((w) => new Date(w.timestamp).toDateString() === today), path: '/workout' },
            { label: 'Mood', done: moods.some((m) => new Date(m.timestamp).toDateString() === today), path: '/mood' },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex-1 rounded-xl p-3 text-center transition-all ${
                item.done ? 'bg-emerald-50 border-2 border-emerald-200' : 'bg-gray-50 border-2 border-dashed border-gray-200 hover:border-emerald-300'
              }`}
            >
              <div className={`w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center ${item.done ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                {item.done && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
              </div>
              <span className={`text-xs font-medium ${item.done ? 'text-emerald-700' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Streak Calendar */}
      <StreakCalendar meals={meals} workouts={workouts} moods={moods} />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform`}>
              {action.icon}
            </div>
            <span className="font-medium text-sm text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {latestMeal && (
            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl">
              <span className="text-xl">🍽️</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{latestMeal.meal_name}</p>
                <p className="text-xs text-gray-400">{latestMeal.nutrition?.calories} kcal</p>
              </div>
              <span className="text-xs text-gray-400">{timeAgo(latestMeal.timestamp)}</span>
            </div>
          )}
          {latestWorkout && (
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <span className="text-xl">💪</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{latestWorkout.exercise_detected}</p>
                <p className="text-xs text-gray-400">Form: {latestWorkout.form_score}/10</p>
              </div>
              <span className="text-xs text-gray-400">{timeAgo(latestWorkout.timestamp)}</span>
            </div>
          )}
          {latestMood && (
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
              <span className="text-xl">{MOOD_CATEGORIES[latestMood.mood_category]?.emoji || '😐'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{MOOD_CATEGORIES[latestMood.mood_category]?.label || 'Okay'}</p>
                <p className="text-xs text-gray-400">Score: {latestMood.mood_score}/10</p>
              </div>
              <span className="text-xs text-gray-400">{timeAgo(latestMood.timestamp)}</span>
            </div>
          )}
          {!latestMeal && !latestWorkout && !latestMood && (
            <p className="text-sm text-gray-400 text-center py-4">No activity yet. Start by logging a meal, workout, or mood!</p>
          )}
        </div>
      </div>
    </div>
  )
}

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
