import { gearPath } from '../lib/gear-path.js'

const PATH = gearPath(10, 46, 36, 14)

export default function GearIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d={PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}
