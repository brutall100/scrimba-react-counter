import { useEffect, useRef } from 'react'
import { gearPath } from '../lib/gear-path.js'

const GEARS = [
  { className: 'bg__gear--a', path: gearPath(16, 47, 42, 10) },
  { className: 'bg__gear--b', path: gearPath(12, 46, 40, 14) },
  { className: 'bg__gear--c', path: gearPath(9, 45, 37, 16) },
]
const SYMBOLS = ['+1', '+1', '+1', '+5', '+10', '0', '1', '2', '7', '9']
const random = (min, max) => min + Math.random() * (max - min)

// Theme-coloured animated backdrop: glows, turning gears, neon floor and
// rising digits. Decorative only, so it is hidden from screen readers.
export default function LiveBackground() {
  const particlesRef = useRef(null)

  useEffect(() => {
    const layer = particlesRef.current
    if (!layer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const amount = window.matchMedia('(max-width: 640px)').matches ? 9 : 18
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < amount; i++) {
      const particle = document.createElement('span')
      particle.className = `bg__particle ${i % 3 === 0 ? 'bg__particle--brass' : ''}`
      particle.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
      particle.style.setProperty('--x', `${random(2, 96)}vw`)
      particle.style.setProperty('--size', `${random(0.8, 1.9).toFixed(2)}rem`)
      particle.style.setProperty('--duration', `${random(11, 22).toFixed(1)}s`)
      particle.style.setProperty('--delay', `${-random(0, 22).toFixed(1)}s`)
      particle.style.setProperty('--drift', `${random(-60, 60).toFixed(0)}px`)
      particle.style.setProperty('--spin', `${random(-40, 40).toFixed(0)}deg`)
      fragment.append(particle)
    }
    layer.append(fragment)
    return () => layer.replaceChildren()
  }, [])

  return (
    <div className="bg" aria-hidden="true">
      <div className="bg__glow bg__glow--brass" />
      <div className="bg__glow bg__glow--violet" />
      <div className="bg__floor">
        <div className="bg__floor-grid" />
      </div>
      {GEARS.map((gear) => (
        <svg key={gear.className} className={`bg__gear ${gear.className}`} viewBox="0 0 100 100">
          <path d={gear.path} fillRule="evenodd" />
        </svg>
      ))}
      <div className="bg__particles" ref={particlesRef} />
    </div>
  )
}
