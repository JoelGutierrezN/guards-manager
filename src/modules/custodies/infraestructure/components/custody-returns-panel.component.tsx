import { type JSX } from 'react'
import { PackageDeliveredIcon } from '@hugeicons/core-free-icons'
import { Empty } from '../../../shared/infraestructure/components/ui'
import type { CustodyReturnSummary } from '../../domain/custody.entity'
import { CustodyReturnRow } from './custody-return-row.component'

interface Props {
  returns: CustodyReturnSummary[]
}

export function CustodyReturnsPanel({ returns }: Props): JSX.Element {
  return (
    <section className="overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h2 className="text-[14px] font-semibold text-ink">Historial de devoluciones</h2>
        <span className="font-mono text-[11px] text-muted">{returns.length}</span>
      </header>

      {returns.length === 0 ? (
        <Empty
          icon={PackageDeliveredIcon}
          title="Sin devoluciones"
          body="Todavía no se registra ninguna devolución para este resguardo."
        />
      ) : (
        <ul>
          {returns.map((entry) => (
            <CustodyReturnRow key={entry.id} entry={entry} />
          ))}
        </ul>
      )}
    </section>
  )
}
