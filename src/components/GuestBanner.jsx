import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function GuestBanner() {
  const { user } = useAuth()

  if (!user?.isAnonymous) return null

  return (
    <div className="bg-gradient-to-r from-amber-400 to-orange-400 text-white text-center py-2 px-4 text-sm font-medium">
      You&apos;re in demo mode &mdash;{' '}
      <Link to="/signup" className="underline font-semibold hover:text-white/90 transition-colors">
        Sign up to save your data
      </Link>
    </div>
  )
}
