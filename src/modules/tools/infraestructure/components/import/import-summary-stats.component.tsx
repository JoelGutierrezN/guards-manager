import { type JSX } from 'react'
import type { ImportBatch } from '../../../domain/import-batch.entity'

interface Props {
  batch: ImportBatch
}

export function ImportSummaryStats({ batch }: Props): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="rounded-[14px] border border-hairline bg-white px-3 py-2.5">
        <div className="text-[18px] font-semibold text-ink">{batch.createdCount}</div>
        <div className="text-[11px] text-muted">Productos creados</div>
      </div>
      <div className="rounded-[14px] border border-hairline bg-white px-3 py-2.5">
        <div className="text-[18px] font-semibold text-ink">{batch.reusedCount}</div>
        <div className="text-[11px] text-muted">Marcas/modelos reutilizados</div>
      </div>
      <div className="rounded-[14px] border border-hairline bg-white px-3 py-2.5">
        <div className="text-[18px] font-semibold text-ink">{batch.fuzzyCount}</div>
        <div className="text-[11px] text-muted">Posibles duplicados</div>
      </div>
      <div className="rounded-[14px] border border-hairline bg-white px-3 py-2.5">
        <div className="text-[18px] font-semibold text-danger">{batch.errorCount}</div>
        <div className="text-[11px] text-muted">Filas con error</div>
      </div>
    </div>
  )
}
