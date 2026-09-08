import { type JSX, useMemo } from 'react'
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Task01Icon,
  UserAdd01Icon,
} from '@hugeicons/core-free-icons'
import { Button, Icon } from '../../../../shared/infraestructure/components/ui'
import { CustodyPresenter } from '../../../application/custody-presenter.helper'
import type { CustodyDetail } from '../../../domain/custody.entity'

interface Props {
  custody: CustodyDetail
  onViewCustody: () => void
  onNewAssignment: () => void
}

const SIGN_PENDING_TIP = 'La firma del resguardo llega en la siguiente entrega.'

export function NewAssignmentSuccess({
  custody,
  onViewCustody,
  onNewAssignment,
}: Props): JSX.Element {
  const itemsLabel = useMemo(
    () => CustodyPresenter.quantityText(custody.itemsCount, 'unidad', 'unidades'),
    [custody.itemsCount],
  )

  return (
    <section className="rounded-[18px] border border-ok-soft bg-ok-soft p-5">
      <header className="mb-4 flex items-center gap-2 text-ok">
        <Icon icon={CheckmarkCircle02Icon} size={18} />
        <h2 className="m-0 text-[14px] font-semibold">Resguardo creado</h2>
      </header>

      <div className="mb-4 rounded-[14px] border border-hairline bg-white px-4 py-3">
        <p className="m-0 text-[12px] text-muted">Folio del resguardo</p>
        <p className="m-0 font-mono text-[18px] font-semibold text-ink">{custody.code}</p>
        <p className="m-0 mt-1 text-[12px] text-ink-2">
          {itemsLabel} a nombre de {custody.employee.name} ({custody.employee.identifier}).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span title={SIGN_PENDING_TIP}>
          <Button variant="primary" icon={Task01Icon} disabled>
            Firmar ahora
          </Button>
        </span>
        <Button iconRight={ArrowRight01Icon} onClick={onViewCustody}>
          Ver resguardo
        </Button>
        <Button variant="ghost" icon={UserAdd01Icon} onClick={onNewAssignment}>
          Nueva asignación
        </Button>
      </div>
      <p className="m-0 mt-3 text-[11px] text-muted">{SIGN_PENDING_TIP}</p>
    </section>
  )
}
