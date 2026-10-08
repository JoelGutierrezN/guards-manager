import { type JSX } from 'react'
import type { DashboardChartPoint } from '../../application/dashboard-chart.model'

interface Props {
  point: DashboardChartPoint
  isActive: boolean
}

export function DashboardChartMarker({ point, isActive }: Props): JSX.Element {
  return (
    <circle
      cx={point.x}
      cy={point.assignmentsY}
      r={isActive ? 4 : 2.5}
      fill="#272871"
      stroke="#fff"
      strokeWidth="1.5"
    />
  )
}
