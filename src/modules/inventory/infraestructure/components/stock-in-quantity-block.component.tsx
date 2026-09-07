import { type JSX, useMemo } from 'react'
import {
  FormField,
  NumberInput,
  Select,
  type SelectOption,
} from '../../../shared/infraestructure/components/ui'
import { ItemConditionHelper } from '../../../shared/domain/item-condition.helper'
import type { ItemCondition } from '../../../shared/domain/item-condition.model'
import {
  MAX_STOCK_IN_QUANTITY,
  MIN_STOCK_IN_QUANTITY,
} from '../../application/stock-in-state.model'

interface Props {
  quantity: number
  condition: ItemCondition
  quantityError?: string
  conditionError?: string
  disabled: boolean
  onQuantityChange: (quantity: number) => void
  onConditionChange: (condition: ItemCondition) => void
}

const QUANTITY_FIELD_ID = 'stock-in-quantity'
const CONDITION_FIELD_ID = 'stock-in-condition'

export function StockInQuantityBlock({
  quantity,
  condition,
  quantityError,
  conditionError,
  disabled,
  onQuantityChange,
  onConditionChange,
}: Props): JSX.Element {
  const conditionOptions = useMemo<SelectOption[]>(
    () =>
      ItemConditionHelper.assignable().map((descriptor) => ({
        value: descriptor.value,
        label: descriptor.label,
      })),
    [],
  )

  const handleConditionChange = (value: string) => {
    if (ItemConditionHelper.isItemCondition(value)) onConditionChange(value)
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <FormField
        label="Cantidad"
        htmlFor={QUANTITY_FIELD_ID}
        hint={`${MIN_STOCK_IN_QUANTITY}–${MAX_STOCK_IN_QUANTITY}`}
        helpText="Unidades que se dan de alta con un folio consecutivo cada una."
        error={quantityError}
        required
      >
        <NumberInput
          id={QUANTITY_FIELD_ID}
          ariaLabel="Cantidad de unidades"
          value={quantity}
          min={MIN_STOCK_IN_QUANTITY}
          max={MAX_STOCK_IN_QUANTITY}
          suffix="uds."
          disabled={disabled}
          error={quantityError !== undefined}
          onChange={onQuantityChange}
        />
      </FormField>

      <FormField
        label="Condición"
        htmlFor={CONDITION_FIELD_ID}
        helpText="Solo condiciones utilizables; las malas se registran al devolver."
        error={conditionError}
        required
      >
        <Select
          id={CONDITION_FIELD_ID}
          ariaLabel="Condición de las unidades"
          value={condition}
          options={conditionOptions}
          disabled={disabled}
          error={conditionError !== undefined}
          onChange={handleConditionChange}
        />
      </FormField>
    </div>
  )
}
