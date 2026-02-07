export const STORAGE_KEYS = {
  MEALS: 'hh_meals',
  WORKOUTS: 'hh_workouts',
  MOODS: 'hh_moods',
  CHAT_HISTORY: 'hh_chat',
  DAILY_TIP: 'hh_daily_tip',
}

export const MOOD_CATEGORIES = {
  great: { label: 'Great', emoji: '😊', color: '#10b981' },
  good: { label: 'Good', emoji: '🙂', color: '#34d399' },
  okay: { label: 'Okay', emoji: '😐', color: '#fbbf24' },
  low: { label: 'Low', emoji: '😔', color: '#f97316' },
  bad: { label: 'Bad', emoji: '😢', color: '#ef4444' },
}

export const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/meals', label: 'Meals', icon: 'meal' },
  { path: '/workout', label: 'Workout', icon: 'workout' },
  { path: '/mood', label: 'Mood', icon: 'mood' },
  { path: '/chat', label: 'Coach', icon: 'chat' },
  { path: '/progress', label: 'Progress', icon: 'progress' },
]
