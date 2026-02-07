import { useState, useCallback } from 'react'

export default function useStorage(key, initialValue = []) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value) => {
    setStoredValue((prev) => {
      const newValue = typeof value === 'function' ? value(prev) : value
      localStorage.setItem(key, JSON.stringify(newValue))
      return newValue
    })
  }, [key])

  const addItem = useCallback((item) => {
    setValue((prev) => [{ ...item, id: Date.now(), timestamp: new Date().toISOString() }, ...prev])
  }, [setValue])

  const clear = useCallback(() => {
    localStorage.removeItem(key)
    setStoredValue(initialValue)
  }, [key, initialValue])

  return { data: storedValue, setData: setValue, addItem, clear }
}
