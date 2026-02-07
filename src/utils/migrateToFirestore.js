import { collection, addDoc, doc, setDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { STORAGE_KEYS } from './constants'

export async function migrateToFirestore(uid) {
  const flag = `hh_migrated_${uid}`
  if (localStorage.getItem(flag)) return

  try {
    const migrations = [
      { key: STORAGE_KEYS.MEALS, col: 'meals' },
      { key: STORAGE_KEYS.WORKOUTS, col: 'workouts' },
      { key: STORAGE_KEYS.MOODS, col: 'moods' },
    ]

    for (const { key, col } of migrations) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const items = JSON.parse(raw)
      if (!Array.isArray(items) || items.length === 0) continue

      const colRef = collection(db, 'users', uid, col)
      for (const item of items) {
        const { id, ...rest } = item
        await addDoc(colRef, rest)
      }
    }

    // Migrate chat history
    const chatRaw = localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY)
    if (chatRaw) {
      const messages = JSON.parse(chatRaw)
      if (Array.isArray(messages) && messages.length > 0) {
        await setDoc(doc(db, 'users', uid, 'chat', 'history'), {
          messages: messages.slice(-50),
        })
      }
    }

    localStorage.setItem(flag, 'true')
  } catch (error) {
    console.error('Migration to Firestore failed:', error)
  }
}
