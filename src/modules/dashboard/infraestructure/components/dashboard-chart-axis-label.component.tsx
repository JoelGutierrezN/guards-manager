import { type JSX } from 'react'
import type { DashboardChartPoint } from '../../application/dashboard-chart.model'

interface Props {
  point: DashboardChartPoint
  labelY: number
}

export function DashboardChartAxisLabel({ point, labelY }: Props): JSX.Element {
  return (
    <text
      x={point.x}
      y={labelY}
      fontSize="9"
      fill="#7b7388"
      fontFamily="JetBrains Mono"
      textAnchor="middle"
    >
      {point.label}
    </text>
  )
}
