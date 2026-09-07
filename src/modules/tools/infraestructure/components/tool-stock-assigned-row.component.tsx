import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import { ITEM_CONDITION_MAP } from '../../../shared/domain/item-condition.model'
import type { ToolUnit } from '../../domain/tool-unit.model'
import { StockUnitCustodyHelper } from '../helpers/stock-unit-custody.helper'

interface Props {
  unit: ToolUnit
}

export function ToolStockAssignedRow({ unit }: Props): JSX.Element {
  const condition = ITEM_CONDITION_MAP[unit.condition]

  return (
    <tr>
      <td className="border-b border-hairline px-3 py-1.5 font-mono font-medium text-ink">
        {unit.consecutive}
      </td>
      <td className="border-b border-hairline px-3 py-1.5">
        <Chip tone={condition.tone} size="sm" dot>
          {condition.label}
        </Chip>
      </td>
      <td className="border-b border-hairline px-3 py-1.5 text-ink-2">
        {StockUnitCustodyHelper.holderLabel(unit.custody)}
      </td>
      <td className="border-b border-hairline px-3 py-1.5 font-mono text-[12px] text-muted">
        {unit.custody?.code ?? '—'}
      </td>
      <td className="border-b border-hairline px-3 py-1.5 font-mono text-[12px] text-muted">
        {StockUnitCustodyHelper.assignedAtLabel(unit.custody)}
      </td>
    </tr>
  )
}
