import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Demo() {
  const { user, loginAsGuest } = useAuth()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      loginAsGuest().catch((err) => {
        console.error('Demo login failed:', err)
        setError(err.message || 'Demo login failed.')
      })
    }
  }, [user, loginAsGuest])

  if (user) return <Navigate to="/dashboard" replace />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <a href="/" className="text-emerald-600 font-medium hover:underline">Back to Home</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Starting demo...</p>
      </div>
    </div>
  )
}
