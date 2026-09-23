import { STEPS } from '../lib/counter-reducer.js'

// Segmented "gear shift": how much one click adds or removes.
export default function StepPicker({ step, onChange }) {
  return (
    <fieldset className="step-picker">
      <legend className="label">Step size</legend>
      <div className="step-picker__options">
        {STEPS.map((value) => (
          <label key={value} className="step-picker__option">
            <input
              type="radio"
              name="step"
              value={value}
              checked={step === value}
              onChange={() => onChange(value)}
            />
            <span>×{value}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
