const WHEEL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

// Mechanical counter: each digit is a strip 0–9 that rolls into place.
export default function Odometer({ value, minDigits = 4 }) {
  const digits = String(Math.abs(value)).padStart(minDigits, '0').split('').map(Number)

  return (
    <div className="odometer" aria-hidden="true">
      <span className={`odometer__sign ${value < 0 ? 'is-shown' : ''}`}>−</span>
      {digits.map((digit, index) => (
        <span
          className={`odometer__wheel ${index === digits.length - 1 ? 'odometer__wheel--last' : ''}`}
          key={digits.length - index}
        >
          <span className="odometer__strip" style={{ transform: `translateY(${-digit * 10}%)` }}>
            {WHEEL.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </span>
        </span>
      ))}
    </div>
  )
}
