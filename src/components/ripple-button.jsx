// Button with a ripple that spreads from where it was pressed.
export default function RippleButton({ className = '', onPointerDown, children, ...props }) {
  function handlePointerDown(event) {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    const ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.width = ripple.style.height = `${size}px`
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`
    ripple.addEventListener('animationend', () => ripple.remove())
    button.append(ripple)
    onPointerDown?.(event)
  }

  return (
    <button type="button" className={`btn ${className}`} onPointerDown={handlePointerDown} {...props}>
      {children}
    </button>
  )
}
