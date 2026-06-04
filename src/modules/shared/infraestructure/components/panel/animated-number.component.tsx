import { type JSX } from 'react'
import { useCountUp } from './use-count-up.hook'

interface AnimatedNumberProps {
  value: number
}

export function AnimatedNumber({ value }: AnimatedNumberProps): JSX.Element {
  const n = useCountUp(value)
  return <span>{n.toLocaleString('es-MX')}</span>
}
