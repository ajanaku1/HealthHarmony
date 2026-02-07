import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'

export async function seedDemoData(uid) {
  const mealsRef = collection(db, 'users', uid, 'meals')
  const snapshot = await getDocs(mealsRef)
  if (snapshot.size > 0) return // already seeded

  const now = Date.now()
  const day = 86400000

  const meals = [
    {
      meal_name: 'Grilled Chicken Salad',
      ingredients: ['grilled chicken', 'mixed greens', 'cherry tomatoes', 'avocado', 'olive oil dressing'],
      nutrition: { calories: 420, protein_g: 38, carbs_g: 15, fat_g: 24, fiber_g: 7 },
      health_score: 9,
      health_notes: 'Excellent lean protein with healthy fats from avocado. Great micronutrient variety from mixed greens.',
      healthier_swaps: ['Use lemon juice instead of oil dressing to cut 50 calories'],
      recipe_suggestion: 'Try adding quinoa for extra protein and fiber.',
      timestamp: new Date(now - day * 0.5).toISOString(),
    },
    {
      meal_name: 'Oatmeal with Berries',
      ingredients: ['rolled oats', 'blueberries', 'strawberries', 'honey', 'almond milk'],
      nutrition: { calories: 310, protein_g: 8, carbs_g: 52, fat_g: 7, fiber_g: 6 },
      health_score: 8,
      health_notes: 'Great complex carbs and antioxidants from berries. Good morning energy source.',
      healthier_swaps: ['Replace honey with mashed banana for natural sweetness'],
      recipe_suggestion: 'Add chia seeds and walnuts for omega-3 fatty acids.',
      timestamp: new Date(now - day * 1.5).toISOString(),
    },
    {
      meal_name: 'Salmon with Roasted Vegetables',
      ingredients: ['Atlantic salmon', 'broccoli', 'sweet potato', 'bell peppers', 'garlic'],
      nutrition: { calories: 520, protein_g: 42, carbs_g: 35, fat_g: 22, fiber_g: 8 },
      health_score: 10,
      health_notes: 'Outstanding meal — rich in omega-3s, complete protein, and a rainbow of vegetables for vitamins.',
      healthier_swaps: ['Already very healthy! Consider wild-caught salmon for even more omega-3s.'],
      recipe_suggestion: 'Try a lemon-herb marinade for the salmon with dill and capers.',
      timestamp: new Date(now - day * 2.5).toISOString(),
    },
  ]

  const workouts = [
    {
      exercise_detected: 'Push-ups',
      reps_counted: 15,
      form_score: 7,
      form_feedback: ['Good depth on each rep', 'Core engagement is solid', 'Elbows flare slightly at the bottom'],
      corrections: ['Keep elbows at 45 degrees to reduce shoulder strain', 'Maintain a straight line from head to heels'],
      injury_risk: 'low',
      next_workout_suggestion: 'Try diamond push-ups to target triceps more. Aim for 3 sets of 12.',
      encouragement: 'Great effort! Your form is improving — keep pushing!',
      timestamp: new Date(now - day * 1).toISOString(),
    },
    {
      exercise_detected: 'Squats',
      reps_counted: 12,
      form_score: 8,
      form_feedback: ['Excellent depth — breaking parallel', 'Knees track well over toes', 'Good hip hinge pattern'],
      corrections: ['Slow down the descent for more time under tension'],
      injury_risk: 'low',
      next_workout_suggestion: 'Progress to goblet squats with a light dumbbell for added resistance.',
      encouragement: 'Fantastic squat form! Your lower body strength is really showing.',
      timestamp: new Date(now - day * 2).toISOString(),
    },
  ]

  const moodEntries = [
    {
      mood_score: 8,
      mood_category: 'great',
      energy_level: 'high',
      emotions_detected: ['happy', 'motivated', 'grateful'],
      summary: 'Feeling energized and positive after a productive morning workout and a healthy breakfast.',
      wellness_tip: 'Channel this positive energy into a creative project or social activity today.',
      affirmation: 'You are building healthy habits that fuel your best self. Keep shining!',
      timestamp: new Date(now - day * 0.3).toISOString(),
    },
    {
      mood_score: 6,
      mood_category: 'okay',
      energy_level: 'medium',
      emotions_detected: ['calm', 'reflective', 'slightly tired'],
      summary: 'A balanced day — feeling steady but could use a bit more energy and motivation.',
      wellness_tip: 'Try a 10-minute walk outside to boost your energy and mood naturally.',
      affirmation: 'Every day doesn\'t have to be perfect. You\'re doing great by showing up.',
      timestamp: new Date(now - day * 1.3).toISOString(),
    },
    {
      mood_score: 7,
      mood_category: 'good',
      energy_level: 'medium',
      emotions_detected: ['content', 'focused', 'hopeful'],
      summary: 'Feeling good about recent progress. Steady mood with a sense of purpose.',
      wellness_tip: 'Write down three things you accomplished today to reinforce positive momentum.',
      affirmation: 'Your consistency is your superpower. Small steps lead to big changes.',
      timestamp: new Date(now - day * 2.3).toISOString(),
    },
    {
      mood_score: 9,
      mood_category: 'great',
      energy_level: 'high',
      emotions_detected: ['excited', 'confident', 'inspired'],
      summary: 'Incredible energy and positivity! Feeling inspired and ready to take on challenges.',
      wellness_tip: 'Use this momentum to set a new fitness goal or try a healthy recipe you\'ve been curious about.',
      affirmation: 'You radiate positive energy. Trust your journey and enjoy the process!',
      timestamp: new Date(now - day * 2.8).toISOString(),
    },
  ]

  const batch = []
  for (const meal of meals) {
    batch.push(addDoc(collection(db, 'users', uid, 'meals'), meal))
  }
  for (const workout of workouts) {
    batch.push(addDoc(collection(db, 'users', uid, 'workouts'), workout))
  }
  for (const mood of moodEntries) {
    batch.push(addDoc(collection(db, 'users', uid, 'moods'), mood))
  }

  await Promise.all(batch)
}
