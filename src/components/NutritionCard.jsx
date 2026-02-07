import GeminiBadge from './GeminiBadge'

export default function NutritionCard({ data }) {
  if (!data) return null

  const macros = [
    { label: 'Protein', value: data.nutrition?.protein_g, unit: 'g', color: 'bg-blue-500' },
    { label: 'Carbs', value: data.nutrition?.carbs_g, unit: 'g', color: 'bg-amber-500' },
    { label: 'Fat', value: data.nutrition?.fat_g, unit: 'g', color: 'bg-red-400' },
    { label: 'Fiber', value: data.nutrition?.fiber_g, unit: 'g', color: 'bg-green-500' },
  ]

  const total = (data.nutrition?.protein_g || 0) + (data.nutrition?.carbs_g || 0) + (data.nutrition?.fat_g || 0)

  return (
    <div className="card space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg">{data.meal_name}</h3>
            <GeminiBadge />
          </div>
          <p className="text-sm text-gray-500 mt-1">{data.ingredients?.join(', ')}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold gradient-text">{data.nutrition?.calories}</span>
          <span className="text-sm text-gray-400">kcal</span>
        </div>
      </div>

      {/* Health Score */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Health Score</span>
        <div className="flex-1 bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${(data.health_score || 0) * 10}%` }}
          />
        </div>
        <span className="font-bold text-emerald-600">{data.health_score}/10</span>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-4 gap-3">
        {macros.map((m) => (
          <div key={m.label} className="text-center">
            <div className="relative w-14 h-14 mx-auto mb-1">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-gray-100" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9" fill="none"
                  className={m.color.replace('bg-', 'stroke-')}
                  strokeWidth="3"
                  strokeDasharray={`${total ? ((m.value || 0) / total) * 100 : 0} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {m.value || 0}
              </span>
            </div>
            <span className="text-xs text-gray-500">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Notes */}
      {data.health_notes && (
        <div className="bg-emerald-50 rounded-xl p-4">
          <p className="text-sm text-emerald-800">{data.health_notes}</p>
        </div>
      )}

      {/* Healthier Swaps */}
      {data.healthier_swaps?.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Healthier Alternatives</h4>
          <ul className="space-y-1">
            {data.healthier_swaps.map((swap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-emerald-500 mt-0.5">&#9679;</span>
                {swap}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recipe suggestion */}
      {data.recipe_suggestion && (
        <div className="bg-teal-50 rounded-xl p-4">
          <h4 className="text-sm font-medium text-teal-700 mb-1">Recipe Idea</h4>
          <p className="text-sm text-teal-600">{data.recipe_suggestion}</p>
        </div>
      )}
    </div>
  )
}
