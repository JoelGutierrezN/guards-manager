import { type JSX } from 'react'
import { useCountUp } from '../../hooks/use-count-up.hook'

interface Props {
  value: number
}

export function DashboardAnimatedNumber({ value }: Props): JSX.Element {
  const animatedValue = useCountUp(value)
  return <span>{animatedValue.toLocaleString('es-MX')}</span>
}
