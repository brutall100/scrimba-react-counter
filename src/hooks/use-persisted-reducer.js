import { useEffect, useReducer } from 'react'

// useReducer that saves its state in localStorage and restores it on load.
export function usePersistedReducer(reducer, initialState, key) {
  const [state, dispatch] = useReducer(reducer, initialState, (fallback) => {
    try {
      const saved = JSON.parse(localStorage.getItem(key))
      return saved && typeof saved === 'object' ? { ...fallback, ...saved } : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // Storage can be blocked (private mode); the app still works without it.
    }
  }, [key, state])

  return [state, dispatch]
}
