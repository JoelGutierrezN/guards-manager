import { useEffect, useState } from 'react'

const DEFAULT_DURATION_MS = 900

export function useCountUp(target: number, duration = DEFAULT_DURATION_MS): number {
  const [value, setValue] = useState(0)

  useEffect(() => {
    const finalValue = Number.isFinite(target) ? target : 0
    const startedAt = performance.now()
    let frameHandle = 0

    const tick = (now: number): void => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(finalValue * eased))
      if (progress < 1) frameHandle = requestAnimationFrame(tick)
    }

    frameHandle = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameHandle)
  }, [target, duration])

  return value
}
