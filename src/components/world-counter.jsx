import { useCountUp } from '../hooks/use-count-up.js'
import { useReveal } from '../hooks/use-reveal.js'
import { useWorldCounter } from '../hooks/use-world-counter.js'
import RippleButton from './ripple-button.jsx'

const numberFormat = new Intl.NumberFormat('en-US')

const STATUS_TEXT = {
  demo: 'Demo mode',
  connecting: 'Connecting…',
  online: 'Online',
  live: 'Live',
  offline: 'Offline',
}

const NOTE_TEXT = {
  demo: 'Supabase is not connected, so this only counts in your browser.',
  connecting: 'Fetching the number everyone shares…',
  online: 'Every visitor adds to the same number.',
  live: 'Every visitor adds to the same number. Watch it move.',
  offline: 'Could not reach the world counter. Try again later.',
}

// One number shared by every visitor, stored in Supabase.
export default function WorldCounter() {
  const ref = useReveal()
  const { value, status, increment } = useWorldCounter()
  const shown = useCountUp(value ?? 0)
  const ready = value !== null && status !== 'offline' && status !== 'connecting'

  return (
    <section className="card reveal world" ref={ref} aria-labelledby="world-title">
      <div className="card__head">
        <h2 id="world-title" className="card__title">
          <svg className="world__globe" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
          </svg>
          World counter
        </h2>
        <span className={`world__status world__status--${status}`}>
          <span className="world__dot" aria-hidden="true" />
          {STATUS_TEXT[status]}
        </span>
      </div>

      <p className="world__value">
        <span className="visually-hidden">Total clicks from everyone: </span>
        {value === null ? '—' : numberFormat.format(shown)}
        <span key={value} className="world__ping" aria-hidden="true" />
      </p>
      <p className="world__note">{NOTE_TEXT[status]}</p>

      <RippleButton className="btn--primary world__button" onClick={increment} disabled={!ready}>
        +1 for the world
      </RippleButton>
    </section>
  )
}
