import { type JSX, useMemo } from 'react'
import { ArrowTurnBackwardIcon, MoreHorizontalIcon } from '@hugeicons/core-free-icons'
import { Checkbox, Chip, IconButton } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import { EmployeeFilePresenter } from '../../application/employee-file-presenter.helper'
import type { EmployeeFileItem } from '../../domain/employee-file-item.model'

interface Props {
  item: EmployeeFileItem
  selected: boolean
  onToggle: (itemId: string) => void
}

const BASE_CELL_CLASS_NAME =
  'border-b border-hairline px-3 py-[9px] align-middle text-ink-2 transition-[background] duration-[120ms]'

const PENDING_TIP = 'En desarrollo'

const DISABLED_ACTION_CLASS_NAME = 'disabled:cursor-not-allowed disabled:opacity-40'

export function EmployeeFileItemRow({ item, selected, onToggle }: Props): JSX.Element {
  const cellClassName = useMemo(
    () => cn(BASE_CELL_CLASS_NAME, selected ? 'bg-brand-soft' : 'group-hover/row:bg-paper-tint'),
    [selected],
  )

  const monoCellClassName = useMemo(
    () => cn(cellClassName, 'font-mono text-[11px]'),
    [cellClassName],
  )

  const custodyCellClassName = useMemo(
    () => cn(cellClassName, 'cursor-default font-mono text-[11px] text-brand'),
    [cellClassName],
  )

  const dateCellClassName = useMemo(
    () => cn(cellClassName, 'font-mono text-[11px] text-muted'),
    [cellClassName],
  )

  const actionsCellClassName = useMemo(() => cn(cellClassName, 'text-right'), [cellClassName])

  return (
    <tr className="group/row">
      <td className={cellClassName}>
        <Checkbox checked={selected} onChange={() => onToggle(item.id)} />
      </td>
      <td className={cellClassName}>
        <div className="text-[12px] font-medium text-ink">{item.productName}</div>
        <div className="font-mono text-[11px] text-muted">
          {EmployeeFilePresenter.toolLabel(item)}
        </div>
      </td>
      <td className={monoCellClassName}>{item.stockConsecutive}</td>
      {/* La pantalla de asignaciones todavía no existe, por eso el folio no navega. */}
      <td className={custodyCellClassName} title={PENDING_TIP}>
        {item.custodyCode}
      </td>
      <td className={dateCellClassName}>{EmployeeFilePresenter.dotDate(item.assignedAt)}</td>
      <td className={cellClassName}>
        <Chip tone="navy" size="sm" dot>
          asignada
        </Chip>
      </td>
      <td className={actionsCellClassName}>
        <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-[120ms] group-hover/row:opacity-100">
          <IconButton
            icon={ArrowTurnBackwardIcon}
            tip={PENDING_TIP}
            size="sm"
            disabled
            aria-label="Devolver"
            className={DISABLED_ACTION_CLASS_NAME}
          />
          <IconButton
            icon={MoreHorizontalIcon}
            tip={PENDING_TIP}
            size="sm"
            disabled
            aria-label="Más acciones"
            className={DISABLED_ACTION_CLASS_NAME}
          />
        </div>
      </td>
    </tr>
  )
}
