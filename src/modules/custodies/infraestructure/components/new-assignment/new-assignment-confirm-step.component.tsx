import { type ChangeEvent, type JSX, useCallback } from 'react'
import { FormField, Textarea } from '../../../../shared/infraestructure/components/ui'
import type { ItemCondition } from '../../../../shared/domain/item-condition.model'
import type { NewAssignmentCartItem } from '../../../application/new-assignment-state.model'
import type { NewAssignmentErrorReport } from '../../../domain/new-assignment-error.model'
import type { EmployeeOption } from '../../../domain/employee-option.model'
import { NewAssignmentConfirmRow } from './new-assignment-confirm-row.component'
import { NewAssignmentEmployeeCard } from './new-assignment-employee-card.component'
import { NewAssignmentPanel } from './new-assignment-panel.component'

interface Props {
  employee: EmployeeOption | null
  items: NewAssignmentCartItem[]
  notes: string
  error: NewAssignmentErrorReport | null
  disabled: boolean
  onItemConditionChange: (stockId: string, condition: ItemCondition) => void
  onItemNotesChange: (stockId: string, notes: string) => void
  onRemoveItem: (stockId: string) => void
  onNotesChange: (notes: string) => void
}

export function NewAssignmentConfirmStep({
  employee,
  items,
  notes,
  error,
  disabled,
  onItemConditionChange,
  onItemNotesChange,
  onRemoveItem,
  onNotesChange,
}: Props): JSX.Element {
  const handleNotesChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => onNotesChange(event.target.value),
    [onNotesChange],
  )

  return (
    <NewAssignmentPanel
      title="Confirmación"
      hint="Revisa la condición con la que entregas cada unidad y agrega notas si hace falta."
    >
      <div className="flex flex-col gap-4">
        {employee !== null && <NewAssignmentEmployeeCard employee={employee} />}

        <ul className="m-0 flex list-none flex-col gap-2 p-0">
          {items.map((item) => (
            <NewAssignmentConfirmRow
              key={item.stock.id}
              item={item}
              errorMessage={error?.itemErrors[item.stock.id]}
              disabled={disabled}
              onConditionChange={onItemConditionChange}
              onNotesChange={onItemNotesChange}
              onRemove={onRemoveItem}
            />
          ))}
        </ul>

        <FormField
          label="Notas del resguardo"
          htmlFor="new-assignment-notes"
          helpText="Opcional. Se guarda junto al resguardo."
          error={error?.fieldErrors.notes}
        >
          <Textarea
            id="new-assignment-notes"
            value={notes}
            onChange={handleNotesChange}
            placeholder="Condiciones de entrega, observaciones…"
            maxLength={2000}
            disabled={disabled}
            error={error?.fieldErrors.notes !== undefined}
          />
        </FormField>
      </div>
    </NewAssignmentPanel>
  )
}
