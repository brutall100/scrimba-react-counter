import { useEffect, useRef, useState } from 'react'
import GearIcon from './components/gear-icon.jsx'
import GoalMeter from './components/goal-meter.jsx'
import HistoryList from './components/history-list.jsx'
import LiveBackground from './components/live-background.jsx'
import Odometer from './components/odometer.jsx'
import RippleButton from './components/ripple-button.jsx'
import Stats from './components/stats.jsx'
import StepPicker from './components/step-picker.jsx'
import ThemeToggle from './components/theme-toggle.jsx'
import { counterReducer, initialState } from './lib/counter-reducer.js'
import { usePersistedReducer } from './hooks/use-persisted-reducer.js'

const SPARKS = Array.from({ length: 12 }, (_, i) => i * 30)
let floaterId = 0

function isTyping(target) {
  return target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable]')
}

export default function App() {
  const [state, dispatch] = usePersistedReducer(counterReducer, initialState, 'neon-odometer')
  const [floaters, setFloaters] = useState([])
  const [celebrating, setCelebrating] = useState(false)
  const goalsSeen = useRef(state.goalsReached)
  const { count, step, goal, history, clicks, best, goalsReached } = state

  function change(direction) {
    dispatch({ type: 'change', direction })
    const text = `${direction > 0 ? '+' : '−'}${step}`
    setFloaters((list) => [...list, { id: floaterId++, text, up: direction > 0 }])
  }

  function reset() {
    dispatch({ type: 'reset' })
  }

  // Keyboard: ↑ / + adds, ↓ / − removes, R resets.
  const changeRef = useRef(change)
  changeRef.current = change
  useEffect(() => {
    function onKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey || isTyping(event.target)) return
      if (event.key === 'ArrowUp' || event.key === '+' || event.key === '=') {
        event.preventDefault()
        changeRef.current(1)
      } else if (event.key === 'ArrowDown' || event.key === '-') {
        event.preventDefault()
        changeRef.current(-1)
      } else if (event.key === 'r' || event.key === 'R') {
        dispatch({ type: 'reset' })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [dispatch])

  // Celebrate each time the goal is crossed.
  useEffect(() => {
    if (goalsReached > goalsSeen.current) {
      setCelebrating(true)
      const timer = setTimeout(() => setCelebrating(false), 1800)
      goalsSeen.current = goalsReached
      return () => clearTimeout(timer)
    }
    goalsSeen.current = goalsReached
  }, [goalsReached])

  const gearTurn = { '--turn': `${count * 36}deg` }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <LiveBackground />

      <header className="site-header">
        <a className="brand" href="#main">
          <GearIcon className="brand__gear" />
          <span>
            Neon <strong>Odometer</strong>
          </span>
        </a>
        <ThemeToggle />
      </header>

      <main id="main" className="layout" tabIndex={-1}>
        <section className={`machine ${celebrating ? 'is-celebrating' : ''}`} aria-labelledby="machine-title">
          <span className="machine__rivet machine__rivet--tl" />
          <span className="machine__rivet machine__rivet--tr" />
          <span className="machine__rivet machine__rivet--bl" />
          <span className="machine__rivet machine__rivet--br" />

          <p className="machine__eyebrow">Tally unit Nº 42</p>
          <h1 id="machine-title" className="machine__title">
            Count anything, one turn at a time.
          </h1>

          <div className="machine__display">
            <Odometer value={count} />
            <p className="visually-hidden" aria-live="polite">
              Count: {count}
            </p>
            <div className="floaters" aria-hidden="true">
              {floaters.map((floater) => (
                <span
                  key={floater.id}
                  className={`floater ${floater.up ? '' : 'floater--down'}`}
                  onAnimationEnd={() => setFloaters((list) => list.filter((f) => f.id !== floater.id))}
                >
                  {floater.text}
                </span>
              ))}
            </div>
            <div className="sparks" aria-hidden="true">
              {celebrating && SPARKS.map((angle) => <span key={angle} className="spark" style={{ '--angle': `${angle}deg` }} />)}
            </div>
          </div>

          <p className="visually-hidden" aria-live="assertive">
            {celebrating ? `Goal of ${goal} reached!` : ''}
          </p>

          <div className="machine__controls" style={gearTurn}>
            <RippleButton className="btn--ghost" onClick={() => change(-1)} aria-label={`Subtract ${step}`}>
              <GearIcon className="btn__gear btn__gear--reverse" />
              <span aria-hidden="true">−{step}</span>
            </RippleButton>
            <RippleButton className="btn--primary" onClick={() => change(1)} aria-label={`Add ${step}`}>
              <GearIcon className="btn__gear" />
              <span aria-hidden="true">+{step}</span>
            </RippleButton>
            <RippleButton className="btn--ghost" onClick={reset} disabled={count === 0}>
              Reset
            </RippleButton>
          </div>

          <div className="machine__footer">
            <StepPicker step={step} onChange={(value) => dispatch({ type: 'set-step', step: value })} />
            <p className="keys">
              <kbd>↑</kbd> add <kbd>↓</kbd> subtract <kbd>R</kbd> reset
            </p>
          </div>
        </section>

        <div className="side">
          <GoalMeter
            count={count}
            goal={goal}
            reached={goal > 0 && count >= goal}
            onGoalChange={(value) => dispatch({ type: 'set-goal', goal: value })}
          />
          <Stats clicks={clicks} best={best} goalsReached={goalsReached} />
          <HistoryList history={history} onClear={() => dispatch({ type: 'clear-history' })} />
        </div>
      </main>

      <footer className="site-footer">
        <p>
          Built with React + Vite while learning on{' '}
          <a href="https://scrimba.com" target="_blank" rel="noreferrer">
            Scrimba
          </a>
          . Saved in your browser only.
        </p>
      </footer>
    </>
  )
}
