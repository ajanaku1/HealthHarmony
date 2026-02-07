import { useState, useEffect, useCallback } from 'react'
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../contexts/AuthContext'

export default function useFirestore(collectionName) {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setData([])
      setLoading(false)
      return
    }

    const colRef = collection(db, 'users', user.uid, collectionName)
    const q = query(colRef, orderBy('timestamp', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
      setData(items)
      setLoading(false)
    }, (error) => {
      console.error(`Firestore error (${collectionName}):`, error)
      setLoading(false)
    })

    return unsubscribe
  }, [user, collectionName])

  const addItem = useCallback((item) => {
    if (!user) return
    const entry = { ...item, timestamp: new Date().toISOString() }
    // Optimistic update
    setData((prev) => [{ ...entry, id: 'temp_' + Date.now() }, ...prev])
    addDoc(collection(db, 'users', user.uid, collectionName), entry).catch((error) => {
      console.error(`Failed to add to ${collectionName}:`, error)
    })
  }, [user, collectionName])

  const clear = useCallback(() => {
    if (!user) return
    setData([])
    getDocs(collection(db, 'users', user.uid, collectionName)).then((snapshot) => {
      snapshot.docs.forEach((d) => {
        deleteDoc(doc(db, 'users', user.uid, collectionName, d.id)).catch(() => {})
      })
    }).catch((error) => {
      console.error(`Failed to clear ${collectionName}:`, error)
    })
  }, [user, collectionName])

  return { data, addItem, clear, loading }
}
