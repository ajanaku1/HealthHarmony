export const CHAT_TOOL_DECLARATIONS = [
  {
    functionDeclarations: [
      {
        name: 'get_recent_meals',
        description: 'Retrieve the user\'s recent meal logs with nutrition data',
        parameters: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of recent meals to retrieve (default 5)' },
          },
        },
      },
      {
        name: 'get_recent_workouts',
        description: 'Retrieve the user\'s recent workout logs with form scores',
        parameters: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of recent workouts to retrieve (default 5)' },
          },
        },
      },
      {
        name: 'get_recent_moods',
        description: 'Retrieve the user\'s recent mood logs with scores and emotions',
        parameters: {
          type: 'object',
          properties: {
            limit: { type: 'number', description: 'Number of recent moods to retrieve (default 5)' },
          },
        },
      },
      {
        name: 'get_wellness_stats',
        description: 'Get aggregate wellness statistics (averages, totals, streaks)',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ],
  },
]

export function buildToolContext(meals, workouts, moods) {
  return {
    get_recent_meals: ({ limit = 5 } = {}) => {
      const recent = (meals || []).slice(0, limit)
      if (recent.length === 0) return { meals: [], message: 'No meals logged yet.' }
      return {
        meals: recent.map((m) => ({
          name: m.meal_name,
          calories: m.nutrition?.calories,
          protein_g: m.nutrition?.protein_g,
          carbs_g: m.nutrition?.carbs_g,
          fat_g: m.nutrition?.fat_g,
          health_score: m.health_score,
          date: new Date(m.timestamp).toLocaleDateString(),
        })),
      }
    },
    get_recent_workouts: ({ limit = 5 } = {}) => {
      const recent = (workouts || []).slice(0, limit)
      if (recent.length === 0) return { workouts: [], message: 'No workouts logged yet.' }
      return {
        workouts: recent.map((w) => ({
          exercise: w.exercise_detected,
          form_score: w.form_score,
          reps: w.reps_counted,
          injury_risk: w.injury_risk,
          date: new Date(w.timestamp).toLocaleDateString(),
        })),
      }
    },
    get_recent_moods: ({ limit = 5 } = {}) => {
      const recent = (moods || []).slice(0, limit)
      if (recent.length === 0) return { moods: [], message: 'No moods logged yet.' }
      return {
        moods: recent.map((m) => ({
          category: m.mood_category,
          score: m.mood_score,
          energy: m.energy_level,
          emotions: m.emotions_detected,
          date: new Date(m.timestamp).toLocaleDateString(),
        })),
      }
    },
    get_wellness_stats: () => {
      const allMeals = meals || []
      const allWorkouts = workouts || []
      const allMoods = moods || []
      const avgMood = allMoods.length > 0
        ? (allMoods.reduce((s, m) => s + (m.mood_score || 0), 0) / allMoods.length).toFixed(1)
        : null
      const avgCalories = allMeals.length > 0
        ? Math.round(allMeals.reduce((s, m) => s + (m.nutrition?.calories || 0), 0) / allMeals.length)
        : null
      const avgForm = allWorkouts.length > 0
        ? (allWorkouts.reduce((s, w) => s + (w.form_score || 0), 0) / allWorkouts.length).toFixed(1)
        : null
      return {
        total_meals: allMeals.length,
        total_workouts: allWorkouts.length,
        total_moods: allMoods.length,
        avg_mood_score: avgMood,
        avg_calories: avgCalories,
        avg_form_score: avgForm,
      }
    },
  }
}
