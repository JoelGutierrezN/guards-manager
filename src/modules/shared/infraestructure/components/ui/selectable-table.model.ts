import type { ReactNode } from 'react'

export interface SelectableTableColumn<TRow> {
  key: string
  header: ReactNode
  headerClassName?: string
  cellClassName?: string
  render: (row: TRow) => ReactNode
}

export interface SelectableTableRowView<TRow> {
  id: string
  row: TRow
  selected: boolean
  selectable: boolean
}
