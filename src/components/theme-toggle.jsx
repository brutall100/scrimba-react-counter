import { useEffect, useState } from 'react'

function readTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Follow the system setting until the visitor picks a theme themselves.
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      let saved = null
      try {
        saved = localStorage.getItem('theme')
      } catch {
        saved = null
      }
      if (!saved) setTheme(media.matches ? 'dark' : 'light')
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try {
      localStorage.setItem('theme', next)
    } catch {
      // Not saved, but the switch still works for this visit.
    }
  }

  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Light theme' : 'Dark theme'}
    >
      <span className="theme-toggle__track">
        <span className="theme-toggle__knob">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            {isDark ? (
              <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4.5" />
                <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
              </>
            )}
          </svg>
        </span>
      </span>
    </button>
  )
}
