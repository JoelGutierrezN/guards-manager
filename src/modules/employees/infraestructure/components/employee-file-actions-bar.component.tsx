import { type JSX, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { ArrowTurnBackwardIcon, Link01Icon } from '@hugeicons/core-free-icons'
import { Button } from '../../../shared/infraestructure/components/ui'
import { ReturnNavigationHelper } from '../../../custodies/infraestructure/helpers/return-navigation.helper'
import { cn } from '../../../shared/infraestructure/utils/cn'
import { EmployeeFilePresenter } from '../../application/employee-file-presenter.helper'
import { EmployeeFileSelectionHelper } from '../../application/employee-file-selection.helper'
import type { EmployeeFileItem } from '../../domain/employee-file-item.model'

interface Props {
  selectionCount: number
  totalCount: number
  onClearSelection: () => void
  items?: EmployeeFileItem[]
  selectedItemIds?: ReadonlySet<string>
}

const MOVE_PENDING_TIP = 'En desarrollo'
const MIXED_CUSTODIES_TIP = 'Selecciona unidades de un mismo resguardo'
const NO_ITEMS_TIP = 'Este colaborador no tiene unidades en resguardo'

const EMPTY_ITEMS: EmployeeFileItem[] = []
const EMPTY_SELECTION: ReadonlySet<string> = new Set<string>()

export function EmployeeFileActionsBar({
  selectionCount,
  totalCount,
  onClearSelection,
  items = EMPTY_ITEMS,
  selectedItemIds = EMPTY_SELECTION,
}: Props): JSX.Element {
  const navigate = useNavigate()
  const hasSelection = selectionCount > 0

  const barClassName = useMemo(
    () =>
      cn(
        'flex flex-wrap items-center gap-2 border-b border-hairline px-4 py-2.5 transition-[background] duration-[200ms]',
        hasSelection ? 'bg-brand-soft' : 'bg-transparent',
      ),
    [hasSelection],
  )

  const partialCustodyId = useMemo(
    () => EmployeeFileSelectionHelper.custodyIdOf(items, selectedItemIds),
    [items, selectedItemIds],
  )

  const totalCustodyId = useMemo(() => EmployeeFileSelectionHelper.firstCustodyId(items), [items])

  const handlePartialReturn = useCallback(() => {
    if (partialCustodyId === null) return
    void navigate(
      ReturnNavigationHelper.returnPath(
        partialCustodyId,
        EmployeeFileSelectionHelper.stockIdsOf(items, selectedItemIds),
      ),
    )
  }, [navigate, partialCustodyId, items, selectedItemIds])

  const handleTotalReturn = useCallback(() => {
    if (totalCustodyId === null) return
    void navigate(
      ReturnNavigationHelper.returnPath(
        totalCustodyId,
        EmployeeFileSelectionHelper.stockIdsOfCustody(items, totalCustodyId),
      ),
    )
  }, [navigate, totalCustodyId, items])

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
            <Button size="sm" icon={Link01Icon} disabled tip={MOVE_PENDING_TIP}>
              Mover a otra asign.
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={ArrowTurnBackwardIcon}
              disabled={partialCustodyId === null}
              tip={partialCustodyId === null ? MIXED_CUSTODIES_TIP : undefined}
              title={partialCustodyId === null ? MIXED_CUSTODIES_TIP : undefined}
              onClick={handlePartialReturn}
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
            <Button
              size="sm"
              icon={ArrowTurnBackwardIcon}
              disabled={totalCustodyId === null}
              tip={totalCustodyId === null ? NO_ITEMS_TIP : undefined}
              title={totalCustodyId === null ? NO_ITEMS_TIP : undefined}
              onClick={handleTotalReturn}
            >
              Devolución total
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
