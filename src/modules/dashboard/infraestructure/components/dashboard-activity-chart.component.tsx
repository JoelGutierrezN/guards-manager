import { type JSX, type MouseEvent, useCallback, useState } from 'react'
import type { DashboardChartView } from '../../application/dashboard-chart.model'
import { DashboardChartAxisLabel } from './dashboard-chart-axis-label.component'
import { DashboardChartGridLineItem } from './dashboard-chart-grid-line.component'
import { DashboardChartMarker } from './dashboard-chart-marker.component'
import { DashboardChartTooltip } from './dashboard-chart-tooltip.component'

interface Props {
  chart: DashboardChartView
}

const GRID_LEFT_X = 28
const GRID_RIGHT_OFFSET = 12

export function DashboardActivityChart({ chart }: Props): JSX.Element {
  const lastIndex = Math.max(0, chart.points.length - 1)
  const [activeIndex, setActiveIndex] = useState(lastIndex)
  const boundedActiveIndex = Math.min(activeIndex, lastIndex)
  const activePoint = chart.points[boundedActiveIndex]

  const handleMove = useCallback(
    (event: MouseEvent<SVGSVGElement>) => {
      if (chart.points.length === 0) return
      const bounds = event.currentTarget.getBoundingClientRect()
      const positionInChart = ((event.clientX - bounds.left) / bounds.width) * chart.width
      const distances = chart.points.map((point) => Math.abs(point.x - positionInChart))
      const closest = distances.indexOf(Math.min(...distances))
      setActiveIndex(closest)
    },
    [chart.points, chart.width],
  )

  const handleLeave = useCallback(() => setActiveIndex(lastIndex), [lastIndex])

  return (
    <div className="relative">
      <svg
        role="img"
        aria-label="Asignaciones y devoluciones por semana"
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        width="100%"
        className="block h-auto"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        <defs>
          <linearGradient id="dashboard-assignments-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#272871" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#272871" stopOpacity="0" />
          </linearGradient>
        </defs>

        {chart.gridLines.map((line) => (
          <DashboardChartGridLineItem
            key={line.key}
            line={line}
            fromX={GRID_LEFT_X}
            toX={chart.width - GRID_RIGHT_OFFSET}
          />
        ))}

        {chart.points.map((point) => (
          <DashboardChartAxisLabel key={point.key} point={point} labelY={chart.labelY} />
        ))}

        <path d={chart.assignmentsAreaPath} fill="url(#dashboard-assignments-fill)" />
        <path
          d={chart.returnsPath}
          stroke="#aea7bb"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="3 3"
        />
        <path d={chart.assignmentsPath} stroke="#272871" strokeWidth="2.2" fill="none" />

        {chart.points.map((point, index) => (
          <DashboardChartMarker
            key={point.key}
            point={point}
            isActive={index === boundedActiveIndex}
          />
        ))}

        {activePoint && (
          <line
            x1={activePoint.x}
            x2={activePoint.x}
            y1={chart.topY}
            y2={chart.baselineY}
            stroke="#272871"
            strokeOpacity="0.25"
            strokeDasharray="3 3"
          />
        )}
      </svg>

      {activePoint && <DashboardChartTooltip point={activePoint} chartWidth={chart.width} />}
    </div>
  )
}
