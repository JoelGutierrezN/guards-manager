import { type ChangeEvent, type JSX, useCallback } from 'react'
import { PackageSearchIcon, Search01Icon } from '@hugeicons/core-free-icons'
import {
  Button,
  Combobox,
  FormField,
  Input,
  Pager,
  type ComboboxItem,
  type ComboboxOptionsLoader,
} from '../../../../shared/infraestructure/components/ui'
import type { NewAssignmentUnitsState } from '../../../application/new-assignment-units-state.model'
import { NewAssignmentPanel } from './new-assignment-panel.component'
import { NewAssignmentUnitsTable } from './new-assignment-units-table.component'

interface Props {
  units: NewAssignmentUnitsState
  cartStockIds: string[]
  loadProductOptions: ComboboxOptionsLoader
  onSelectProduct: (item: ComboboxItem | null) => void
  onConsecutiveChange: (consecutive: string) => void
  onPageChange: (page: number) => void
  onSelectionChange: (selectedIds: string[]) => void
  onAdd: () => void
  onRetry: () => void
}

export function NewAssignmentUnitsStep({
  units,
  cartStockIds,
  loadProductOptions,
  onSelectProduct,
  onConsecutiveChange,
  onPageChange,
  onSelectionChange,
  onAdd,
  onRetry,
}: Props): JSX.Element {
  const handleConsecutiveChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onConsecutiveChange(event.target.value),
    [onConsecutiveChange],
  )

  return (
    <NewAssignmentPanel
      title="Unidades disponibles"
      hint="Filtra por herramienta o escribe un folio de unidad, marca las que entregas y agrégalas."
    >
      <div className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField label="Herramienta" htmlFor="new-assignment-product">
            <Combobox
              id="new-assignment-product"
              ariaLabel="Buscar herramienta"
              placeholder="Nombre de la herramienta…"
              emptyMessage="Sin herramientas que coincidan"
              value={units.product?.id ?? null}
              selectedLabel={units.product?.name ?? null}
              loadOptions={loadProductOptions}
              onChange={onSelectProduct}
              leadIcon={PackageSearchIcon}
            />
          </FormField>

          <FormField
            label="Folio de la unidad"
            htmlFor="new-assignment-consecutive"
            helpText="Por ejemplo IV-0012."
          >
            <Input
              id="new-assignment-consecutive"
              value={units.consecutive}
              onChange={handleConsecutiveChange}
              placeholder="IV-…"
              aria-label="Buscar unidad por folio"
              leadIcon={Search01Icon}
              maxLength={255}
            />
          </FormField>
        </div>

        {units.status === 'error' && units.errorMessage !== null ? (
          <div
            role="alert"
            className="rounded-[14px] border border-danger-soft bg-danger-soft px-4 py-3 text-[13px] text-danger"
          >
            <p className="m-0 font-semibold">{units.errorMessage}</p>
            <div className="mt-2.5">
              <Button size="sm" onClick={onRetry}>
                Reintentar
              </Button>
            </div>
          </div>
        ) : (
          <NewAssignmentUnitsTable
            stocks={units.stocks}
            loading={units.status === 'loading'}
            selectedIds={units.selectedIds}
            cartStockIds={cartStockIds}
            onSelectionChange={onSelectionChange}
            onAdd={onAdd}
          />
        )}

        <Pager
          page={units.page}
          lastPage={units.lastPage}
          total={units.total}
          onChange={onPageChange}
          itemsLabel="unidades disponibles"
        />
      </div>
    </NewAssignmentPanel>
  )
}
