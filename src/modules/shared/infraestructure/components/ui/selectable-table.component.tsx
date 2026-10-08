import { type JSX, type ReactNode, useCallback, useEffect, useMemo } from 'react'
import { cn } from '../../utils/cn'
import { TableLoader } from '../tables/table-loader.component'
import { Checkbox } from './checkbox.component'
import { Empty } from './empty.component'
import { SelectableTableRow } from './selectable-table-row.component'
import { SelectableTableSelectionHelper } from './selectable-table.helper'
import type { SelectableTableColumn, SelectableTableRowView } from './selectable-table.model'

interface Props<TRow> {
  rows: TRow[]
  columns: SelectableTableColumn<TRow>[]
  getRowId: (row: TRow) => string
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  isRowSelectable?: (row: TRow) => boolean
  loading?: boolean
  emptyTitle?: string
  emptyBody?: ReactNode
  emptyAction?: ReactNode
  countLabel?: string
  actions?: ReactNode
  className?: string
}

const HEAD_CLASS_NAME =
  'border-b border-hairline bg-paper-tint px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.08em] text-muted uppercase whitespace-nowrap'

export function SelectableTable<TRow>({
  rows,
  columns,
  getRowId,
  selectedIds,
  onSelectionChange,
  isRowSelectable,
  loading = false,
  emptyTitle = 'Sin elementos para mostrar',
  emptyBody,
  emptyAction,
  countLabel = 'seleccionadas',
  actions,
  className,
}: Props<TRow>): JSX.Element {
  const views = useMemo<SelectableTableRowView<TRow>[]>(
    () =>
      rows.map((row) => {
        const rowId = getRowId(row)
        const selectable = isRowSelectable ? isRowSelectable(row) : true
        return { id: rowId, row, selectable, selected: selectable && selectedIds.includes(rowId) }
      }),
    [rows, getRowId, isRowSelectable, selectedIds],
  )

  const selectableIds = useMemo(
    () => views.filter((view) => view.selectable).map((view) => view.id),
    [views],
  )

  const selectedCount = useMemo(
    () => SelectableTableSelectionHelper.countSelected(selectedIds, selectableIds),
    [selectedIds, selectableIds],
  )

  /** Ningún id puede quedar seleccionado de forma invisible: si la fila ya no es
   * seleccionable (o ya no está en la tabla) se descarta de la selección del padre. */
  useEffect(() => {
    if (loading) return
    if (!SelectableTableSelectionHelper.hasOrphanIds(selectedIds, selectableIds)) return
    onSelectionChange(SelectableTableSelectionHelper.keepSelectable(selectedIds, selectableIds))
  }, [loading, selectedIds, selectableIds, onSelectionChange])

  const areAllSelected = selectableIds.length > 0 && selectedCount === selectableIds.length
  const isPartiallySelected = selectedCount > 0 && !areAllSelected
  const columnCount = columns.length + 1
  const isEmpty = !loading && views.length === 0

  const handleToggleAll = useCallback(() => {
    onSelectionChange(SelectableTableSelectionHelper.toggleAll(selectedIds, selectableIds))
  }, [onSelectionChange, selectedIds, selectableIds])

  const handleToggleRow = useCallback(
    (rowId: string) => onSelectionChange(SelectableTableSelectionHelper.toggle(selectedIds, rowId)),
    [onSelectionChange, selectedIds],
  )

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col overflow-hidden rounded-[18px] border border-hairline bg-white shadow-[0_1px_4px_rgba(14,15,60,0.04)]',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-3 py-2.5">
        <span className="text-[12px] font-medium text-muted tabular-nums">
          {selectedCount} de {selectableIds.length} {countLabel}
        </span>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              <th className={cn(HEAD_CLASS_NAME, 'w-10')}>
                <Checkbox
                  checked={areAllSelected}
                  indeterminate={isPartiallySelected}
                  disabled={selectableIds.length === 0}
                  onChange={handleToggleAll}
                  aria-label="Seleccionar todo"
                />
              </th>
              {columns.map((column) => (
                <th key={column.key} className={cn(HEAD_CLASS_NAME, column.headerClassName)}>
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && <TableLoader width={columnCount} />}
            {isEmpty && (
              <tr>
                <td colSpan={columnCount} className="border-b border-hairline">
                  <Empty title={emptyTitle} body={emptyBody} action={emptyAction} />
                </td>
              </tr>
            )}
            {!loading &&
              views.map((view) => (
                <SelectableTableRow
                  key={view.id}
                  view={view}
                  columns={columns}
                  onToggle={handleToggleRow}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
