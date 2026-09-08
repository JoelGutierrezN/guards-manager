import { type JSX, useMemo } from 'react'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { CustodiesTableColumn } from './custodies-table-columns.model'

interface Props {
  column: CustodiesTableColumn
}

export function CustodiesTableHeaderCell({ column }: Props): JSX.Element {
  const headerClass = useMemo(
    () =>
      cn(
        'sticky top-0 z-1 select-none border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.08em] text-muted whitespace-nowrap',
        column.widthClass,
      ),
    [column.widthClass],
  )

  return <th className={headerClass}>{column.label}</th>
}
