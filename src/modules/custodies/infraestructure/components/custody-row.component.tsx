import { type JSX, type KeyboardEvent } from 'react'
import { Avatar } from '../../../shared/infraestructure/components/ui'
import type { Custody } from '../../domain/custody.entity'
import { CustodyDateHelper } from '../../application/custody-date.helper'
import { CustodySignatureChip } from './custody-signature-chip.component'
import { CustodyStatusChip } from './custody-status-chip.component'

interface Props {
  custody: Custody
  onOpen: () => void
}

export function CustodyRow({ custody, onOpen }: Props): JSX.Element {
  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>): void => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onOpen()
  }

  return (
    <tr
      className="group cursor-pointer transition-colors outline-none [&_td]:hover:bg-paper-tint [&_td]:focus-visible:bg-paper-tint"
      tabIndex={0}
      aria-label={`Abrir el resguardo ${custody.code}`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <td className="px-3 py-2.5 align-middle font-mono text-[12px] font-semibold text-ink">
        {custody.code}
      </td>
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-2.5">
          <Avatar name={custody.employee.name} size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium text-ink">
              {custody.employee.name}
            </span>
            <span className="font-mono text-[11px] text-muted">{custody.employee.identifier}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-ink-2">
        {custody.itemsCount}
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink-2">
        {custody.pendingItemsCount}
      </td>
      <td className="px-3 py-2.5 align-middle">
        <CustodyStatusChip status={custody.status} />
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[12px] text-muted">
        {CustodyDateHelper.date(custody.createdAt)}
      </td>
      <td className="px-3 py-2.5 align-middle">
        <CustodySignatureChip signedAt={custody.signedAt} />
      </td>
    </tr>
  )
}
