import { type JSX } from 'react'
import { ImportDuplicateRow } from './import-duplicate-row.component'
import type {
  ImportAuditEntry,
  ImportAuditEntryAction,
} from '../../../domain/import-audit-entry.entity'

interface Props {
  entries: ImportAuditEntry[]
  resolvingEntryId: string | null
  onResolve: (entryId: string, action: ImportAuditEntryAction) => void
}

export function ImportDuplicatesList({ entries, resolvingEntryId, onResolve }: Props): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] font-semibold text-ink">Posibles duplicados por revisar</p>
      <ul className="flex flex-col gap-2">
        {entries.map((entry) => (
          <ImportDuplicateRow
            key={entry.id}
            entry={entry}
            isResolving={resolvingEntryId === entry.id}
            onKeep={() => onResolve(entry.id, 'keep')}
            onDiscard={() => onResolve(entry.id, 'discard')}
          />
        ))}
      </ul>
    </div>
  )
}
