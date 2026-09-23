// Builds an SVG path for a gear with square-ish teeth, centred at 50,50.
export function gearPath(teeth = 12, outer = 46, inner = 38, hole = 12) {
  const points = []
  const step = (Math.PI * 2) / (teeth * 4)
  for (let i = 0; i < teeth * 4; i++) {
    const r = i % 4 < 2 ? outer : inner
    const a = i * step
    points.push(`${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`)
  }
  return `M${points.join('L')}Z M${50 + hole},50 A${hole},${hole} 0 1,0 ${50 - hole},50 A${hole},${hole} 0 1,0 ${50 + hole},50Z`
}
