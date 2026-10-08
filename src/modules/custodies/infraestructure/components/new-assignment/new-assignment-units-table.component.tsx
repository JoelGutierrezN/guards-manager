import { type JSX, useCallback, useMemo } from 'react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import {
  Button,
  SelectableTable,
  type SelectableTableColumn,
} from '../../../../shared/infraestructure/components/ui'
import type { AvailableStock } from '../../../domain/new-assignment-option.model'
import { NewAssignmentUnitConditionCell } from './new-assignment-unit-condition-cell.component'
import { NewAssignmentUnitProductCell } from './new-assignment-unit-product-cell.component'

interface Props {
  stocks: AvailableStock[]
  loading: boolean
  selectedIds: string[]
  cartStockIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onAdd: () => void
}

const COLUMNS: SelectableTableColumn<AvailableStock>[] = [
  {
    key: 'consecutive',
    header: 'Folio',
    cellClassName: 'font-mono text-[12px] font-semibold text-ink whitespace-nowrap',
    render: (stock) => stock.consecutive,
  },
  {
    key: 'product',
    header: 'Herramienta',
    render: (stock) => <NewAssignmentUnitProductCell product={stock.product} />,
  },
  {
    key: 'condition',
    header: 'Condición',
    cellClassName: 'whitespace-nowrap',
    render: (stock) => <NewAssignmentUnitConditionCell condition={stock.condition} />,
  },
]

export function NewAssignmentUnitsTable({
  stocks,
  loading,
  selectedIds,
  cartStockIds,
  onSelectionChange,
  onAdd,
}: Props): JSX.Element {
  const getRowId = useCallback((stock: AvailableStock) => stock.id, [])

  const isRowSelectable = useCallback(
    (stock: AvailableStock) => !cartStockIds.includes(stock.id),
    [cartStockIds],
  )

  const addLabel = useMemo(
    () =>
      selectedIds.length === 1 ? 'Agregar 1 unidad' : `Agregar ${selectedIds.length} unidades`,
    [selectedIds.length],
  )

  return (
    <SelectableTable
      rows={stocks}
      columns={COLUMNS}
      getRowId={getRowId}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      isRowSelectable={isRowSelectable}
      loading={loading}
      countLabel="unidades seleccionadas"
      emptyTitle="Sin unidades disponibles"
      emptyBody="Ajusta el producto o el folio, o registra un ingreso de inventario."
      actions={
        <Button
          variant="primary"
          size="sm"
          icon={PlusSignIcon}
          disabled={selectedIds.length === 0}
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      }
    />
  )
}
