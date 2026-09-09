import { type JSX, useCallback, useMemo } from 'react'
import type { ItemCondition } from '../../../../shared/domain/item-condition.model'
import {
  SelectableTable,
  type SelectableTableColumn,
} from '../../../../shared/infraestructure/components/ui'
import { ReturnFormHelper } from '../../../application/return-form.helper'
import type { ReturnItemDraft } from '../../../application/return-state.model'
import type { CustodyItem } from '../../../domain/custody.entity'
import { ReturnItemConditionCell } from './return-item-condition-cell.component'
import { ReturnItemNotesCell } from './return-item-notes-cell.component'
import { ReturnItemProductCell } from './return-item-product-cell.component'

interface Props {
  items: CustodyItem[]
  drafts: Record<string, ReturnItemDraft>
  selectedStockIds: string[]
  itemErrors: Record<string, string>
  disabled: boolean
  onSelectionChange: (stockIds: string[]) => void
  onConditionChange: (stockId: string, condition: ItemCondition) => void
  onNotesChange: (stockId: string, notes: string) => void
}

const EMPTY_DRAFT: ReturnItemDraft = { condition: 'BUENO', notes: '' }

export function ReturnItemsTable({
  items,
  drafts,
  selectedStockIds,
  itemErrors,
  disabled,
  onSelectionChange,
  onConditionChange,
  onNotesChange,
}: Props): JSX.Element {
  const getRowId = useCallback((item: CustodyItem) => item.stock.id, [])

  const columns = useMemo<SelectableTableColumn<CustodyItem>[]>(
    () => [
      {
        key: 'product',
        header: 'Unidad',
        render: (item) => (
          <ReturnItemProductCell item={item} errorMessage={itemErrors[item.stock.id]} />
        ),
      },
      {
        key: 'condition',
        header: 'Condición al devolver',
        cellClassName: 'w-[180px]',
        render: (item) => (
          <ReturnItemConditionCell
            stockId={item.stock.id}
            consecutive={item.stock.consecutive}
            condition={(drafts[item.stock.id] ?? EMPTY_DRAFT).condition}
            disabled={disabled}
            hasError={itemErrors[item.stock.id] !== undefined}
            onChange={onConditionChange}
          />
        ),
      },
      {
        key: 'notes',
        header: 'Nota',
        render: (item) => (
          <ReturnItemNotesCell
            stockId={item.stock.id}
            consecutive={item.stock.consecutive}
            notes={(drafts[item.stock.id] ?? EMPTY_DRAFT).notes}
            required={ReturnFormHelper.requiresNote(drafts[item.stock.id])}
            disabled={disabled}
            hasError={itemErrors[item.stock.id] !== undefined}
            onChange={onNotesChange}
          />
        ),
      },
    ],
    [drafts, itemErrors, disabled, onConditionChange, onNotesChange],
  )

  return (
    <SelectableTable
      rows={items}
      columns={columns}
      getRowId={getRowId}
      selectedIds={selectedStockIds}
      onSelectionChange={onSelectionChange}
      countLabel="unidades por devolver"
      emptyTitle="Sin unidades pendientes"
      emptyBody="Todas las herramientas de este resguardo ya fueron devueltas."
    />
  )
}
