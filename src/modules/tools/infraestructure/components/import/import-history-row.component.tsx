import { type JSX } from 'react'
import { Chip } from '../../../../shared/infraestructure/components/ui'
import { ImportStatusHelper } from '../../helpers/import-status.helper'
import { StockUnitDateHelper } from '../../helpers/stock-unit-date.helper'
import type { ImportBatch } from '../../../domain/import-batch.entity'

interface Props {
  batch: ImportBatch
}

export function ImportHistoryRow({ batch }: Props): JSX.Element {
  return (
    <li className="flex items-center justify-between gap-3 rounded-[14px] border border-hairline bg-white px-3 py-2.5">
      <div className="min-w-0">
        <div className="truncate text-[13px] font-medium text-ink">{batch.originalFilename}</div>
        <div className="text-[11px] text-muted">
          {StockUnitDateHelper.format(batch.createdAt)} · {batch.createdCount} creados ·{' '}
          {batch.errorCount} con error
        </div>
      </div>
      <Chip tone={ImportStatusHelper.tone(batch.status)}>
        {ImportStatusHelper.label(batch.status)}
      </Chip>
    </li>
  )
}
