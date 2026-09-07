import { type JSX, useMemo } from 'react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { IconButton, Select } from '../../../shared/infraestructure/components/ui'
import type { SelectOption } from '../../../shared/infraestructure/components/ui'
import { ITEM_CONDITIONS, ITEM_CONDITION_MAP } from '../../../shared/domain/item-condition.model'
import type { ItemCondition } from '../../../shared/domain/item-condition.model'
import type { ToolUnit } from '../../domain/tool-unit.model'
import { StockUnitDateHelper } from '../helpers/stock-unit-date.helper'

interface Props {
  unit: ToolUnit
  pending: boolean
  onConditionChange: (unit: ToolUnit, condition: ItemCondition) => void
  onDelete: (unit: ToolUnit) => void
}

const CONDITION_OPTIONS: SelectOption[] = ITEM_CONDITIONS.map((condition) => ({
  value: condition,
  label: ITEM_CONDITION_MAP[condition].label,
}))

export function ToolStockUnitRow({
  unit,
  pending,
  onConditionChange,
  onDelete,
}: Props): JSX.Element {
  const rowClassName = useMemo(
    () =>
      pending
        ? 'border-b border-hairline px-3 py-1.5 opacity-60'
        : 'border-b border-hairline px-3 py-1.5',
    [pending],
  )

  return (
    <tr>
      <td className={`${rowClassName} font-mono font-medium text-ink`}>{unit.consecutive}</td>
      <td className={rowClassName}>
        <Select
          value={unit.condition}
          options={CONDITION_OPTIONS}
          disabled={pending}
          ariaLabel={`Condición de la unidad ${unit.consecutive}`}
          onChange={(value) => onConditionChange(unit, value as ItemCondition)}
          className="h-8 max-w-40"
        />
      </td>
      <td className={`${rowClassName} font-mono text-[12px] text-muted`}>
        {StockUnitDateHelper.format(unit.createdAt)}
      </td>
      <td className={`${rowClassName} w-px whitespace-nowrap text-right`}>
        <IconButton
          icon={Delete02Icon}
          tip="Eliminar unidad"
          size="sm"
          danger
          disabled={pending}
          onClick={() => onDelete(unit)}
        />
      </td>
    </tr>
  )
}
