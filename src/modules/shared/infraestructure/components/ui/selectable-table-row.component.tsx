import { type JSX, memo, useCallback, useMemo } from 'react'
import { cn } from '../../utils/cn'
import { Checkbox } from './checkbox.component'
import type { SelectableTableColumn, SelectableTableRowView } from './selectable-table.model'

interface Props<TRow> {
  view: SelectableTableRowView<TRow>
  columns: SelectableTableColumn<TRow>[]
  onToggle: (rowId: string) => void
}

const CELL_CLASS_NAME = 'border-b border-hairline px-3 py-2.5 align-middle'

function SelectableTableRowInner<TRow>({ view, columns, onToggle }: Props<TRow>): JSX.Element {
  const rowClassName = useMemo(
    () =>
      cn(
        'transition-[background]',
        view.selected ? 'bg-brand-soft' : 'hover:bg-paper-tint',
        !view.selectable && 'opacity-55',
      ),
    [view.selected, view.selectable],
  )

  const handleToggle = useCallback(() => onToggle(view.id), [onToggle, view.id])

  return (
    <tr className={rowClassName}>
      <td className={cn(CELL_CLASS_NAME, 'w-10')}>
        <Checkbox
          checked={view.selected}
          disabled={!view.selectable}
          onChange={handleToggle}
          aria-label="Seleccionar fila"
        />
      </td>
      {columns.map((column) => (
        <td key={column.key} className={cn(CELL_CLASS_NAME, column.cellClassName)}>
          {column.render(view.row)}
        </td>
      ))}
    </tr>
  )
}

export const SelectableTableRow = memo(SelectableTableRowInner) as typeof SelectableTableRowInner
