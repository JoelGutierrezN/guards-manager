import { type CSSProperties, type JSX, useMemo } from 'react'
import type { DashboardChartPoint } from '../../application/dashboard-chart.model'

interface Props {
  point: DashboardChartPoint
  chartWidth: number
}

export function DashboardChartTooltip({ point, chartWidth }: Props): JSX.Element {
  const inlineStyle = useMemo<CSSProperties>(
    () => ({ left: `${(point.x / chartWidth) * 100}%` }),
    [point.x, chartWidth],
  )

  return (
    <div
      className="pointer-events-none absolute top-1 -translate-x-1/2 rounded-lg bg-ink px-2.5 py-1.5 font-mono text-[11px] tracking-[0.02em] whitespace-nowrap text-white shadow-[0_6px_14px_-4px_rgba(26,19,38,0.4)]"
      style={inlineStyle}
    >
      <b className="mb-0.5 block font-sans text-[12px]">Semana del {point.longLabel}</b>
      <span className="text-[#c1c1f1]">● {point.assignments}</span> asignaciones ·{' '}
      <span className="text-white/60">○ {point.returns}</span> devoluciones
    </div>
  )
}
