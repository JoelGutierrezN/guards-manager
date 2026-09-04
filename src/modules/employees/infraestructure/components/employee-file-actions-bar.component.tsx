import { type JSX, useMemo } from 'react'
import { ArrowTurnBackwardIcon, Link01Icon } from '@hugeicons/core-free-icons'
import { Button } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import { EmployeeFilePresenter } from '../../application/employee-file-presenter.helper'

interface Props {
  selectionCount: number
  totalCount: number
  onClearSelection: () => void
}

const PENDING_TIP = 'En desarrollo'

export function EmployeeFileActionsBar({
  selectionCount,
  totalCount,
  onClearSelection,
}: Props): JSX.Element {
  const hasSelection = selectionCount > 0

  const barClassName = useMemo(
    () =>
      cn(
        'flex flex-wrap items-center gap-2 border-b border-hairline px-4 py-2.5 transition-[background] duration-[200ms]',
        hasSelection ? 'bg-brand-soft' : 'bg-transparent',
      ),
    [hasSelection],
  )

  return (
    <div className={barClassName}>
      {hasSelection ? (
        <>
          <span className="text-[12px] font-medium text-ink">
            {EmployeeFilePresenter.selectionLabel(selectionCount, totalCount)}
          </span>
          <button
            type="button"
            onClick={onClearSelection}
            className="cursor-pointer text-[12px] font-medium text-brand underline underline-offset-[3px]"
          >
            Limpiar
          </button>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" icon={Link01Icon} disabled tip={PENDING_TIP}>
              Mover a otra asign.
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={ArrowTurnBackwardIcon}
              disabled
              tip={PENDING_TIP}
            >
              Devolución parcial ({selectionCount})
            </Button>
          </div>
        </>
      ) : (
        <>
          <span className="text-[12px] text-muted">
            Selecciona varias para devolverlas en bloque, o usa el botón individual de cada fila.
          </span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" icon={ArrowTurnBackwardIcon} disabled tip={PENDING_TIP}>
              Devolución total
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
