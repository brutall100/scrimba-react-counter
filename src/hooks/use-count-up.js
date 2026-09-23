import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from './use-reduced-motion.js'

// Animates a number from its previous value to the new one.
export function useCountUp(target, duration = 700) {
  const reduced = useReducedMotion()
  const [shown, setShown] = useState(reduced ? target : 0)
  const from = useRef(shown)

  useEffect(() => {
    if (reduced) {
      from.current = target
      setShown(target)
      return
    }
    const start = performance.now()
    const begin = from.current
    let frame
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      const value = Math.round(begin + (target - begin) * eased)
      from.current = value
      setShown(value)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target, duration, reduced])

  return shown
}
