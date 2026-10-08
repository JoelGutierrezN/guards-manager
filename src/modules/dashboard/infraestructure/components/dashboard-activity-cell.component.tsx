import { type JSX } from 'react'
import { Analytics01Icon } from '@hugeicons/core-free-icons'
import { Empty } from '../../../shared/infraestructure/components/ui'
import type { DashboardChartView } from '../../application/dashboard-chart.model'
import { DashboardActivityChart } from './dashboard-activity-chart.component'
import { DashboardCell } from './dashboard-cell.component'
import { DashboardCellTitle } from './dashboard-cell-title.component'
import { DashboardEyebrow } from './dashboard-eyebrow.component'

interface Props {
  chart: DashboardChartView
}

export function DashboardActivityCell({ chart }: Props): JSX.Element {
  return (
    <DashboardCell span={4} rowSpan={2} label="Actividad semanal">
      <div>
        <DashboardEyebrow>Actividad</DashboardEyebrow>
        <DashboardCellTitle>Asignaciones y devoluciones</DashboardCellTitle>
      </div>

      {chart.points.length === 0 ? (
        <Empty
          icon={Analytics01Icon}
          title="Todavía no hay movimientos"
          body="Cuando registres asignaciones o devoluciones verás aquí su evolución semanal."
        />
      ) : (
        <DashboardActivityChart chart={chart} />
      )}

      <div className="mt-auto flex flex-wrap items-center gap-4 text-[12px] text-muted">
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-2.5 bg-brand" />
          Asignaciones
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0 w-2.5 border-t border-dashed border-muted" />
          Devoluciones
        </span>
        <span className="ml-auto font-mono text-[11px]">
          {chart.weeksCount} semanas · {chart.totalAssignments} asignadas · {chart.totalReturns}{' '}
          devueltas
        </span>
      </div>
    </DashboardCell>
  )
}
