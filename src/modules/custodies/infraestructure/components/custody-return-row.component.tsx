import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import type { CustodyReturnSummary } from '../../domain/custody.entity'
import { CUSTODY_RETURN_TYPE_MAP } from '../../domain/custody-return-type.model'
import { CustodyPresenter } from '../../application/custody-presenter.helper'
import { CustodyDateHelper } from '../../application/custody-date.helper'

interface Props {
  entry: CustodyReturnSummary
}

export function CustodyReturnRow({ entry }: Props): JSX.Element {
  const typeDescriptor = CUSTODY_RETURN_TYPE_MAP[entry.type]

  return (
    <li className="flex items-start gap-3 border-b border-hairline px-4 py-3 last:border-b-0">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ok" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[12px] font-semibold text-ink">{entry.code}</span>
          <Chip tone={typeDescriptor.tone} size="sm">
            {typeDescriptor.label}
          </Chip>
          <span className="text-[12px] text-muted">
            {CustodyPresenter.quantityText(entry.itemsCount, 'unidad', 'unidades')}
          </span>
        </div>
        <span className="text-[12px] text-ink-3">
          {CustodyDateHelper.dateTime(entry.createdAt)}
          {entry.receivedBy != null && ` · Recibió ${entry.receivedBy.name}`}
        </span>
        {entry.notes != null && entry.notes !== '' && (
          <span className="text-[12px] text-muted">{entry.notes}</span>
        )}
      </div>
    </li>
  )
}
