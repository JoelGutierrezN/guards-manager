import { type JSX } from 'react'
import { PackageIcon } from '@hugeicons/core-free-icons'
import { Empty } from '../../../shared/infraestructure/components/ui'
import type { CustodyItem } from '../../domain/custody.entity'
import { CustodyItemRow } from './custody-item-row.component'

interface Props {
  items: CustodyItem[]
}

const HEADER_CLASS =
  'sticky top-0 z-1 select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap'

export function CustodyItemsTable({ items }: Props): JSX.Element {
  return (
    <section className="overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h2 className="text-[14px] font-semibold text-ink">Herramientas en resguardo</h2>
        <span className="font-mono text-[11px] text-muted">{items.length}</span>
      </header>

      {items.length === 0 ? (
        <Empty
          icon={PackageIcon}
          title="Sin herramientas"
          body="Este resguardo no tiene unidades registradas."
        />
      ) : (
        <table className="w-full table-fixed border-collapse text-[13px]">
          <thead>
            <tr>
              <th className={HEADER_CLASS}>Producto</th>
              <th className={`${HEADER_CLASS} w-32`}>Consecutivo</th>
              <th className={`${HEADER_CLASS} w-28`}>Condición</th>
              <th className={`${HEADER_CLASS} w-36`}>Devuelto</th>
              <th className={`${HEADER_CLASS} w-44`}>Notas</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CustodyItemRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
