export default function GeminiBadge({ size = 'xs' }) {
  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-0.5',
    sm: 'text-xs px-2 py-0.5 gap-1',
  }

  return (
    <span className={`inline-flex items-center bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/60 text-blue-700 rounded-full font-medium whitespace-nowrap ${sizes[size] || sizes.xs}`}>
      <svg className={size === 'xs' ? 'w-2.5 h-2.5' : 'w-3 h-3'} viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
      Gemini 3
    </span>
  )
}
