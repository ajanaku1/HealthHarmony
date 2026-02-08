import GeminiBadge from './GeminiBadge'

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function LiveCoachingOverlay({ formScore, reps, exercise, currentTip, bodyPosition, elapsed }) {
  const scoreColor = formScore >= 7 ? 'bg-emerald-500' : formScore >= 5 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Top bar: exercise + timer */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-white text-xs font-medium">LIVE</span>
            <GeminiBadge size="xs" />
          </div>
          <span className="text-white text-sm font-mono bg-black/40 px-2 py-0.5 rounded">
            {formatTime(elapsed)}
          </span>
        </div>
        {exercise && (
          <p className="text-white text-sm font-semibold mt-1">{exercise}</p>
        )}
      </div>

      {/* Right side: form score + reps */}
      <div className="absolute top-16 right-3 flex flex-col items-end gap-2">
        {formScore !== null && (
          <div className={`${scoreColor} rounded-xl px-3 py-2 text-center min-w-[60px]`}>
            <span className="text-white text-xl font-bold block">{formScore}</span>
            <span className="text-white/80 text-[10px]">FORM</span>
          </div>
        )}
        <div className="bg-black/50 rounded-xl px-3 py-2 text-center min-w-[60px]">
          <span className="text-white text-xl font-bold block">{reps}</span>
          <span className="text-white/80 text-[10px]">REPS</span>
        </div>
      </div>

      {/* Bottom: tip bar */}
      {currentTip && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 pt-8">
          <div className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5">
            <p className="text-white text-sm font-medium leading-snug">{currentTip}</p>
            {bodyPosition && (
              <p className="text-white/60 text-xs mt-1">{bodyPosition}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
