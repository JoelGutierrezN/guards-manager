import { type JSX, useCallback, useMemo } from 'react'
import { ItemConditionHelper } from '../../../../shared/domain/item-condition.helper'
import type { ItemCondition } from '../../../../shared/domain/item-condition.model'
import { Select } from '../../../../shared/infraestructure/components/ui'
import { ReturnOptionHelper } from '../../helpers/return-option.helper'

interface Props {
  stockId: string
  consecutive: string
  condition: ItemCondition
  disabled: boolean
  hasError: boolean
  onChange: (stockId: string, condition: ItemCondition) => void
}

export function ReturnItemConditionCell({
  stockId,
  consecutive,
  condition,
  disabled,
  hasError,
  onChange,
}: Props): JSX.Element {
  const options = useMemo(() => ReturnOptionHelper.conditionOptions(), [])

  const handleChange = useCallback(
    (value: string) => {
      if (!ItemConditionHelper.isItemCondition(value)) return
      onChange(stockId, value)
    },
    [onChange, stockId],
  )

  return (
    <Select
      value={condition}
      onChange={handleChange}
      options={options}
      ariaLabel={`Condición de ${consecutive}`}
      disabled={disabled}
      error={hasError}
      className="min-w-[150px]"
    />
  )
}
