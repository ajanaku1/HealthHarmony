import { useState, useMemo } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

function toDateKey(ts) {
  const d = new Date(ts)
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function calculateStreak(activityMap) {
  let streak = 0
  const now = new Date()
  let d = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  // If nothing logged today, start checking from yesterday
  if (!activityMap.has(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`)) {
    d.setDate(d.getDate() - 1)
  }
  while (true) {
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (activityMap.has(key)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export default function StreakCalendar({ meals, workouts, moods }) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const { mealDays, workoutDays, moodDays, activityMap } = useMemo(() => {
    const mealDays = new Set(meals.map((m) => toDateKey(m.timestamp)))
    const workoutDays = new Set(workouts.map((w) => toDateKey(w.timestamp)))
    const moodDays = new Set(moods.map((m) => toDateKey(m.timestamp)))
    const activityMap = new Set([...mealDays, ...workoutDays, ...moodDays])
    return { mealDays, workoutDays, moodDays, activityMap }
  }, [meals, workouts, moods])

  const streak = useMemo(() => calculateStreak(activityMap), [activityMap])
  const calendarDays = getCalendarDays(viewYear, viewMonth)
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }

  function nextMonth() {
    const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()
    if (isCurrentMonth) return
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  const isCurrentMonth = viewYear === today.getFullYear() && viewMonth === today.getMonth()

  return (
    <div className="card">
      {/* Streak badge + header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">Activity Calendar</h2>
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 23a7.5 7.5 0 0 0 7.5-7.5c0-2.34-.98-5.25-2.7-7.89C15.16 5.26 13.26 3.2 12.56 2.5a.75.75 0 0 0-1.12 0C10.74 3.2 8.84 5.26 7.2 7.61 5.48 10.25 4.5 13.16 4.5 15.5A7.5 7.5 0 0 0 12 23z"/>
          </svg>
          <span className="text-sm font-bold">{streak}</span>
          <span className="text-xs font-medium opacity-90">day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700">{monthLabel}</span>
        <button onClick={nextMonth} disabled={isCurrentMonth} className={`p-1.5 rounded-lg transition-colors ${isCurrentMonth ? 'text-gray-200' : 'hover:bg-gray-100 text-gray-500'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {calendarDays.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />

          const key = `${viewYear}-${viewMonth}-${day}`
          const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()
          const hasMeal = mealDays.has(key)
          const hasWorkout = workoutDays.has(key)
          const hasMood = moodDays.has(key)
          const hasAny = hasMeal || hasWorkout || hasMood
          const isFuture = new Date(viewYear, viewMonth, day) > today

          return (
            <div
              key={key}
              className={`relative flex flex-col items-center py-1.5 rounded-lg transition-colors ${
                isToday
                  ? 'bg-emerald-50 ring-2 ring-emerald-400'
                  : hasAny
                    ? 'bg-gray-50'
                    : ''
              }`}
            >
              <span className={`text-xs leading-none ${
                isFuture
                  ? 'text-gray-300'
                  : isToday
                    ? 'font-bold text-emerald-700'
                    : hasAny
                      ? 'font-medium text-gray-700'
                      : 'text-gray-400'
              }`}>
                {day}
              </span>
              {/* Activity dots */}
              {!isFuture && (
                <div className="flex gap-[3px] mt-1 h-[5px]">
                  {hasMeal && <span className="w-[5px] h-[5px] rounded-full bg-orange-400" />}
                  {hasWorkout && <span className="w-[5px] h-[5px] rounded-full bg-blue-400" />}
                  {hasMood && <span className="w-[5px] h-[5px] rounded-full bg-purple-400" />}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span className="text-[10px] text-gray-500">Meal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-[10px] text-gray-500">Workout</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400" />
          <span className="text-[10px] text-gray-500">Mood</span>
        </div>
      </div>
    </div>
  )
}
