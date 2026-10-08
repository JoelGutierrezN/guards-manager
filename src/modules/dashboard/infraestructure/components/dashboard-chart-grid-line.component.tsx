import { type JSX } from 'react'
import type { DashboardChartGridLine } from '../../application/dashboard-chart.model'

interface Props {
  line: DashboardChartGridLine
  fromX: number
  toX: number
}

export function DashboardChartGridLineItem({ line, fromX, toX }: Props): JSX.Element {
  return (
    <g>
      <line
        x1={fromX}
        x2={toX}
        y1={line.y}
        y2={line.y}
        stroke="rgba(26,19,38,0.06)"
        strokeDasharray="2 3"
      />
      <text x={6} y={line.y + 4} fontSize="9" fill="#7b7388" fontFamily="JetBrains Mono">
        {line.value}
      </text>
    </g>
  )
}
