import { type ChangeEvent, type JSX, useCallback, useMemo } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { ItemConditionHelper } from '../../../../shared/domain/item-condition.helper'
import type { ItemCondition } from '../../../../shared/domain/item-condition.model'
import { cn } from '../../../../shared/infraestructure/utils/cn'
import { IconButton, Input, Select } from '../../../../shared/infraestructure/components/ui'
import type { NewAssignmentCartItem } from '../../../application/new-assignment-state.model'
import { NewAssignmentOptionHelper } from '../../helpers/new-assignment-option.helper'

interface Props {
  item: NewAssignmentCartItem
  errorMessage?: string
  disabled: boolean
  onConditionChange: (stockId: string, condition: ItemCondition) => void
  onNotesChange: (stockId: string, notes: string) => void
  onRemove: (stockId: string) => void
}

export function NewAssignmentConfirmRow({
  item,
  errorMessage,
  disabled,
  onConditionChange,
  onNotesChange,
  onRemove,
}: Props): JSX.Element {
  const stockId = item.stock.id

  const rowClassName = useMemo(
    () =>
      cn(
        'grid gap-3 rounded-[16px] border p-3 sm:grid-cols-[minmax(0,1.4fr)_minmax(0,0.8fr)_minmax(0,1.2fr)_auto] sm:items-center',
        errorMessage ? 'border-danger bg-danger-soft' : 'border-hairline bg-white',
      ),
    [errorMessage],
  )

  const conditionOptions = useMemo(() => NewAssignmentOptionHelper.assignableConditionOptions(), [])

  const handleConditionChange = useCallback(
    (value: string) => {
      if (!ItemConditionHelper.isItemCondition(value)) return
      onConditionChange(stockId, value)
    },
    [onConditionChange, stockId],
  )

  const handleNotesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onNotesChange(stockId, event.target.value),
    [onNotesChange, stockId],
  )

  const handleRemove = useCallback(() => onRemove(stockId), [onRemove, stockId])

  return (
    <li className={rowClassName}>
      <div className="min-w-0">
        <p className="m-0 font-mono text-[12px] font-semibold text-ink">{item.stock.consecutive}</p>
        <p className="m-0 truncate text-[13px] text-ink-2">{item.stock.product.name}</p>
        <p className="m-0 truncate text-[11px] text-muted">
          {NewAssignmentOptionHelper.stockProductDetails(item.stock.product)}
        </p>
        {errorMessage && (
          <p className="m-0 mt-1 text-[11px] font-semibold text-danger" role="alert">
            {errorMessage}
          </p>
        )}
      </div>

      <Select
        value={item.condition}
        onChange={handleConditionChange}
        options={conditionOptions}
        ariaLabel={`Condición de ${item.stock.consecutive}`}
        disabled={disabled}
        error={errorMessage !== undefined}
      />

      <Input
        value={item.notes}
        onChange={handleNotesChange}
        placeholder="Nota de la unidad (opcional)"
        aria-label={`Nota de ${item.stock.consecutive}`}
        disabled={disabled}
        maxLength={2000}
      />

      <IconButton
        icon={Delete02Icon}
        size="sm"
        danger
        disabled={disabled}
        title={`Quitar ${item.stock.consecutive}`}
        aria-label={`Quitar ${item.stock.consecutive}`}
        onClick={handleRemove}
      />
    </li>
  )
}
