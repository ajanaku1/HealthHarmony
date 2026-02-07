import GeminiBadge from './GeminiBadge'

export default function WorkoutFeedback({ data }) {
  if (!data) return null

  const scoreColor = data.form_score >= 7 ? 'text-emerald-600' : data.form_score >= 5 ? 'text-amber-600' : 'text-red-500'
  const riskColors = { low: 'bg-green-100 text-green-700', medium: 'bg-amber-100 text-amber-700', high: 'bg-red-100 text-red-700' }

  return (
    <div className="card space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{data.exercise_detected}</h3>
            <GeminiBadge />
          </div>
          {data.reps_counted && (
            <p className="text-sm text-gray-500 mt-1">{data.reps_counted} reps detected</p>
          )}
        </div>
        <div className="text-center">
          <span className={`text-3xl font-bold ${scoreColor}`}>{data.form_score}</span>
          <span className="text-sm text-gray-400">/10</span>
          <p className="text-xs text-gray-400 mt-0.5">Form Score</p>
        </div>
      </div>

      {/* Injury Risk */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Injury Risk:</span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${riskColors[data.injury_risk] || riskColors.low}`}>
          {data.injury_risk?.toUpperCase()}
        </span>
      </div>

      {/* Form Feedback */}
      {data.form_feedback?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Form Analysis</h4>
          <ul className="space-y-2">
            {data.form_feedback.map((fb, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-blue-500 mt-0.5">&#9679;</span>
                {fb}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Corrections */}
      {data.corrections?.length > 0 && (
        <div className="bg-amber-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-amber-700 mb-2">Corrections Needed</h4>
          <ul className="space-y-1">
            {data.corrections.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-600">
                <span>&#9888;</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next workout suggestion */}
      {data.next_workout_suggestion && (
        <div className="bg-emerald-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-emerald-700 mb-1">Next Session</h4>
          <p className="text-sm text-emerald-600">{data.next_workout_suggestion}</p>
        </div>
      )}

      {/* Encouragement */}
      {data.encouragement && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-4">
          <p className="text-sm text-white font-medium">{data.encouragement}</p>
        </div>
      )}
    </div>
  )
}
