import { type JSX, useMemo } from 'react'
import { Button, Chip, Progress } from '../../../../shared/infraestructure/components/ui'
import { ImportStatusHelper } from '../../helpers/import-status.helper'
import { ImportSummaryStats } from './import-summary-stats.component'
import { ImportDuplicatesList } from './import-duplicates-list.component'
import type { ImportBatch } from '../../../domain/import-batch.entity'
import type { ImportAuditEntryAction } from '../../../domain/import-audit-entry.entity'

interface Props {
  batch: ImportBatch
  pollError: string | null
  resolveError: string | null
  resolvingEntryId: string | null
  onResolve: (entryId: string, action: ImportAuditEntryAction) => void
  onRetryPoll: () => void
}

export function ImportBatchPanel({
  batch,
  pollError,
  resolveError,
  resolvingEntryId,
  onResolve,
  onRetryPoll,
}: Props): JSX.Element {
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

      {!isFinished && pollError === null && (
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

      {!isFinished && pollError !== null && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[14px] border border-danger-soft bg-danger-soft px-3 py-2.5">
          <span className="text-[12px] text-danger">{pollError}</span>
          <Button size="sm" onClick={onRetryPoll}>
            Reintentar
          </Button>
        </div>
      )}

      {isFinished && <ImportSummaryStats batch={batch} />}

      {isFinished && batch.errors.length > 0 && (
        <ul className="flex flex-col gap-1 rounded-[14px] border border-danger-soft bg-danger-soft px-3 py-2.5">
          {batch.errors.map((error) => (
            <li key={`${error.row}-${error.message}`} className="text-[12px] text-danger">
              Fila {error.row}: {error.message}
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

      {resolveError !== null && (
        <p className="text-[12px] font-medium text-danger">{resolveError}</p>
      )}
    </div>
  )
}
