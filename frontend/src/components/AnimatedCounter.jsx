import { memo, useEffect, useState } from 'react'

function AnimatedCounter({ value, duration = 900, suffix = '', className = '' }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setDisplayValue(value)
      return undefined
    }

    let animationFrame = 0
    const startValue = Number(displayValue)
    const endValue = Number(value)
    const startTime = performance.now()

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const nextValue = Math.round(startValue + (endValue - startValue) * progress)
      setDisplayValue(nextValue)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(tick)
      }
    }

    animationFrame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animationFrame)
  }, [duration, value])

  return <span className={className}>{displayValue}{suffix}</span>
}

export default memo(AnimatedCounter)