import { type JSX, useCallback, useMemo } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowTurnBackwardIcon, MoreHorizontalIcon } from '@hugeicons/core-free-icons'
import { Checkbox, Chip, IconButton } from '../../../shared/infraestructure/components/ui'
import { ReturnNavigationHelper } from '../../../custodies/infraestructure/helpers/return-navigation.helper'
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

const RETURN_TIP = 'Devolver esta unidad'

const DISABLED_ACTION_CLASS_NAME = 'disabled:cursor-not-allowed disabled:opacity-40'

const CUSTODY_LINK_CLASS_NAME = 'text-brand underline-offset-[3px] hover:underline'

export function EmployeeFileItemRow({ item, selected, onToggle }: Props): JSX.Element {
  const navigate = useNavigate()

  const handleReturn = useCallback(() => {
    void navigate(ReturnNavigationHelper.returnPath(item.custodyId, [item.stockId]))
  }, [navigate, item.custodyId, item.stockId])

  const cellClassName = useMemo(
    () => cn(BASE_CELL_CLASS_NAME, selected ? 'bg-brand-soft' : 'group-hover/row:bg-paper-tint'),
    [selected],
  )

  const monoCellClassName = useMemo(
    () => cn(cellClassName, 'font-mono text-[11px]'),
    [cellClassName],
  )

  const custodyCellClassName = useMemo(
    () => cn(cellClassName, 'font-mono text-[11px]'),
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
      <td className={custodyCellClassName}>
        <Link to={`/assignments/${item.custodyId}`} className={CUSTODY_LINK_CLASS_NAME}>
          {item.custodyCode}
        </Link>
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
            tip={RETURN_TIP}
            size="sm"
            aria-label={`Devolver ${item.stockConsecutive}`}
            onClick={handleReturn}
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
