import { type JSX } from 'react'
import { Button, Chip } from '../../../../shared/infraestructure/components/ui'
import { ImportEntityTypeHelper } from '../../helpers/import-entity-type.helper'
import type { ImportAuditEntry } from '../../../domain/import-audit-entry.entity'

interface Props {
  entry: ImportAuditEntry
  isResolving: boolean
  onKeep: () => void
  onDiscard: () => void
}

export function ImportDuplicateRow({ entry, isResolving, onKeep, onDiscard }: Props): JSX.Element {
  return (
    <li className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-hairline bg-white px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Chip size="sm" tone="warn">
          {ImportEntityTypeHelper.label(entry.entityType)}
        </Chip>
        <span className="text-[12px] text-ink-2">
          Fila {entry.rowNumber} · {entry.similarity}% de similitud con un registro existente
        </span>
      </div>
      <div className="flex gap-2">
        <Button size="sm" disabled={isResolving} onClick={onKeep}>
          Mantener como nuevo
        </Button>
        <Button size="sm" variant="primary" disabled={isResolving} onClick={onDiscard}>
          Fusionar con existente
        </Button>
      </div>
    </li>
  )
}
