import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from './AuthContext'

const UserProfileContext = createContext()

export function useUserProfile() {
  return useContext(UserProfileContext)
}

export function UserProfileProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    const docRef = doc(db, 'users', user.uid, 'profile', 'data')
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setProfile(snapshot.exists() ? snapshot.data() : null)
      setLoading(false)
    }, (error) => {
      console.error('Profile listener error:', error)
      setLoading(false)
    })

    return unsubscribe
  }, [user])

  const updateProfile = useCallback((data) => {
    if (!user) return
    const merged = { ...profile, ...data }
    setProfile(merged)
    // Fire-and-forget: don't await server acknowledgment since local state
    // is already updated and onSnapshot will sync when server confirms.
    // Awaiting setDoc with offline persistence can hang indefinitely.
    setDoc(doc(db, 'users', user.uid, 'profile', 'data'), merged).catch((error) => {
      console.error('Failed to update profile:', error)
    })
  }, [user, profile])

  const value = { profile, loading, updateProfile }

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  )
}
