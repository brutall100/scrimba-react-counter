import { useReveal } from '../hooks/use-reveal.js'

const timeFormat = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export default function HistoryList({ history, onClear }) {
  const ref = useReveal()
  return (
    <section className="card reveal history" ref={ref} aria-labelledby="history-title">
      <div className="card__head">
        <h2 id="history-title" className="card__title">Ticker tape</h2>
        {history.length > 0 && (
          <button type="button" className="link-button" onClick={onClear}>
            Clear
          </button>
        )}
      </div>
      {history.length === 0 ? (
        <p className="history__empty">No moves yet. Press +1 to start the machine.</p>
      ) : (
        <ol className="history__list">
          {history.map((entry) => (
            <li key={entry.id} className="history__item">
              <span className={`history__delta ${entry.delta < 0 ? 'is-minus' : ''}`}>
                {entry.kind === 'reset' ? 'Reset' : `${entry.delta > 0 ? '+' : '−'}${Math.abs(entry.delta)}`}
              </span>
              <span className="history__value">→ {entry.value}</span>
              <time className="history__time" dateTime={new Date(entry.at).toISOString()}>
                {timeFormat.format(entry.at)}
              </time>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
