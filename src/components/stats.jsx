import { useCountUp } from '../hooks/use-count-up.js'
import { useReveal } from '../hooks/use-reveal.js'

function Stat({ label, value }) {
  const shown = useCountUp(value)
  return (
    <div className="stat">
      <dt className="label">{label}</dt>
      <dd className="stat__value">{shown}</dd>
    </div>
  )
}

export default function Stats({ clicks, best, goalsReached }) {
  const ref = useReveal()
  return (
    <section className="card reveal" ref={ref} aria-labelledby="stats-title">
      <h2 id="stats-title" className="card__title">Machine log</h2>
      <dl className="stats">
        <Stat label="Clicks" value={clicks} />
        <Stat label="Best" value={best} />
        <Stat label="Goals" value={goalsReached} />
      </dl>
    </section>
  )
}
