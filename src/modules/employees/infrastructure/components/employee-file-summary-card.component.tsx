import { type JSX } from 'react'
import type { EmployeeFileSummary } from '../../domain/employee-file-summary.model'
import { EmployeeFileSummaryMetric } from './employee-file-summary-metric.component'

interface Props {
  summary: EmployeeFileSummary
}

export function EmployeeFileSummaryCard({ summary }: Props): JSX.Element {
  return (
    <div className="rounded-[26px] border border-hairline bg-white p-3.5 shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
      <div className="mb-2.5 font-mono text-[11px] tracking-[0.22em] text-brand uppercase">
        Resumen
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <EmployeeFileSummaryMetric label="Activas" value={summary.activeItems} tone="brand" />
        <EmployeeFileSummaryMetric label="Histórico" value={summary.historicalItems} />
        <EmployeeFileSummaryMetric label="Devueltas" value={summary.returnedItems} />
        {/* TODO API: daños pendientes de implementación en backend */}
        <EmployeeFileSummaryMetric
          label="Daños"
          value={summary.damagedItems}
          tone="danger"
          hint="Pendiente de implementación"
        />
      </div>
    </div>
  )
}
