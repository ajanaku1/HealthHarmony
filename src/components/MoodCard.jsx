import { MOOD_CATEGORIES } from '../utils/constants'

export default function MoodCard({ data }) {
  if (!data) return null

  const moodInfo = MOOD_CATEGORIES[data.mood_category] || MOOD_CATEGORIES.okay
  const energyColors = { high: 'bg-emerald-100 text-emerald-700', medium: 'bg-blue-100 text-blue-700', low: 'bg-gray-100 text-gray-600' }

  return (
    <div className="card space-y-5">
      {/* Mood header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{moodInfo.emoji}</span>
          <div>
            <h3 className="font-bold text-lg">{moodInfo.label}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${energyColors[data.energy_level] || energyColors.medium}`}>
                {data.energy_level} energy
              </span>
            </div>
          </div>
        </div>
        <div className="text-center">
          <span className="text-3xl font-bold" style={{ color: moodInfo.color }}>{data.mood_score}</span>
          <span className="text-sm text-gray-400">/10</span>
        </div>
      </div>

      {/* Mood bar */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Mood</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${(data.mood_score || 0) * 10}%`, backgroundColor: moodInfo.color }}
          />
        </div>
      </div>

      {/* Emotions */}
      {data.emotions_detected?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.emotions_detected.map((emotion, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
              {emotion}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {data.summary && (
        <p className="text-sm text-gray-600 leading-relaxed">{data.summary}</p>
      )}

      {/* Wellness tip */}
      {data.wellness_tip && (
        <div className="bg-blue-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-blue-700 mb-1">Wellness Tip</h4>
          <p className="text-sm text-blue-600">{data.wellness_tip}</p>
        </div>
      )}

      {/* Affirmation */}
      {data.affirmation && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4">
          <p className="text-sm text-white font-medium italic">&ldquo;{data.affirmation}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
