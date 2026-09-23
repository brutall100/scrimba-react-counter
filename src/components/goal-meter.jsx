import { useReveal } from '../hooks/use-reveal.js'

export default function GoalMeter({ count, goal, reached, onGoalChange }) {
  const ref = useReveal()
  const percent = goal > 0 ? Math.max(0, Math.min(100, (count / goal) * 100)) : 0
  const left = goal - count

  return (
    <section className={`card reveal goal ${reached ? 'goal--reached' : ''}`} ref={ref} aria-labelledby="goal-title">
      <div className="card__head">
        <h2 id="goal-title" className="card__title">Goal</h2>
        <label className="goal__input">
          <span className="visually-hidden">Goal value</span>
          <input
            type="number"
            inputMode="numeric"
            min="0"
            max="9999"
            value={goal}
            onChange={(event) => onGoalChange(Number(event.target.value))}
          />
        </label>
      </div>
      <div
        className="goal__tube"
        role="progressbar"
        aria-label="Progress to goal"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(percent)}
      >
        <span className="goal__fill" style={{ transform: `scaleX(${percent / 100})` }} />
      </div>
      <p className="goal__text">
        {goal === 0
          ? 'Set a goal above zero to track progress.'
          : left > 0
            ? `${left} to go — ${Math.round(percent)}% there.`
            : 'Goal reached! Keep the wheels turning.'}
      </p>
    </section>
  )
}
