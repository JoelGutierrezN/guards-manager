import { type JSX } from 'react'
import { HierarchyFilesIcon } from '@hugeicons/core-free-icons'
import { Empty, Skeleton } from '../../../../shared/infraestructure/components/ui'
import { ImportHistoryRow } from './import-history-row.component'
import type { ImportBatch } from '../../../domain/import-batch.entity'
import type { ImportHistoryStatus } from '../../../application/import-state.model'

interface Props {
  status: ImportHistoryStatus
  history: ImportBatch[]
  onRetry: () => void
}

export function ImportHistoryList({ status, history, onRetry }: Props): JSX.Element {
  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton shape="block" />
        <Skeleton shape="block" />
        <Skeleton shape="block" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <Empty
        icon={HierarchyFilesIcon}
        title="No se pudo cargar el historial"
        body={
          <button type="button" onClick={onRetry} className="cursor-pointer text-brand underline">
            Reintentar
          </button>
        }
      />
    )
  }

  if (history.length === 0) {
    return <Empty icon={HierarchyFilesIcon} title="Sin importaciones todavía" />
  }

  return (
    <ul className="flex flex-col gap-2">
      {history.map((batch) => (
        <ImportHistoryRow key={batch.id} batch={batch} />
      ))}
    </ul>
  )
}
