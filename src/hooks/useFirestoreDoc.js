import { useState, useEffect, useCallback } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'

export default function useFirestoreDoc(docPath) {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setData(null)
      setLoading(false)
      return
    }

    const docRef = doc(db, 'users', user.uid, ...docPath.split('/'))

    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setData(snapshot.exists() ? snapshot.data() : null)
      setLoading(false)
    }, (error) => {
      console.error(`Firestore doc error (${docPath}):`, error)
      setLoading(false)
    })

    return unsubscribe
  }, [user, docPath])

  const setDocData = useCallback((newData) => {
    if (!user) return
    setData(newData)
    setDoc(doc(db, 'users', user.uid, ...docPath.split('/')), newData).catch((error) => {
      console.error(`Failed to set ${docPath}:`, error)
    })
  }, [user, docPath])

  return { data, setData: setDocData, loading }
}
