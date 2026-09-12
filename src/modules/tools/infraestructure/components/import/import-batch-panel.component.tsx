import { type JSX, useMemo } from 'react'
import { Chip, Progress } from '../../../../shared/infraestructure/components/ui'
import { ImportStatusHelper } from '../../helpers/import-status.helper'
import { ImportSummaryStats } from './import-summary-stats.component'
import { ImportDuplicatesList } from './import-duplicates-list.component'
import type { ImportBatch } from '../../../domain/import-batch.entity'
import type { ImportAuditEntryAction } from '../../../domain/import-audit-entry.entity'

interface Props {
  batch: ImportBatch
  resolvingEntryId: string | null
  onResolve: (entryId: string, action: ImportAuditEntryAction) => void
}

export function ImportBatchPanel({ batch, resolvingEntryId, onResolve }: Props): JSX.Element {
  const isFinished = ImportStatusHelper.isFinished(batch.status)

  const isTotalKnown = batch.totalRows > 0

  const progressPercent = useMemo(() => {
    if (!isTotalKnown) return 0
    return Math.round((batch.processedRows / batch.totalRows) * 100)
  }, [isTotalKnown, batch.processedRows, batch.totalRows])

  const unresolvedEntries = useMemo(
    () => batch.auditEntries.filter((entry) => !entry.resolved),
    [batch.auditEntries],
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[13px] font-medium text-ink">{batch.originalFilename}</span>
        <Chip tone={ImportStatusHelper.tone(batch.status)}>
          {ImportStatusHelper.label(batch.status)}
        </Chip>
      </div>

      {!isFinished && (
        <Progress
          value={progressPercent}
          indeterminate={!isTotalKnown}
          label={
            isTotalKnown
              ? `Procesando ${batch.processedRows} de ${batch.totalRows} filas`
              : 'Procesando el archivo…'
          }
        />
      )}

      {isFinished && <ImportSummaryStats batch={batch} />}

      {isFinished && batch.errors.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-[14px] border border-danger-soft bg-danger-soft px-3 py-2.5">
          {batch.errors.map((error) => (
            <li key={error} className="text-[12px] text-danger">
              {error}
            </li>
          ))}
        </ul>
      )}

      {isFinished && unresolvedEntries.length > 0 && (
        <ImportDuplicatesList
          entries={unresolvedEntries}
          resolvingEntryId={resolvingEntryId}
          onResolve={onResolve}
        />
      )}
    </div>
  )
}
