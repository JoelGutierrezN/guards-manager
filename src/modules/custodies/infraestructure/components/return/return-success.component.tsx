import { type JSX, useMemo } from 'react'
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Task01Icon,
  UserSharingIcon,
} from '@hugeicons/core-free-icons'
import { Button, Chip, Icon } from '../../../../shared/infraestructure/components/ui'
import { CUSTODY_RETURN_TYPE_MAP } from '../../../domain/custody-return-type.model'
import { ReturnPresenter } from '../../../application/return-presenter.helper'
import type { CustodyReturn } from '../../../domain/return.entity'

interface Props {
  createdReturn: CustodyReturn
  onViewCustody: () => void
  onViewEmployeeFile: () => void
}

const SIGN_PENDING_TIP = 'La firma de la hoja de devolución llega en la siguiente entrega.'

export function ReturnSuccess({
  createdReturn,
  onViewCustody,
  onViewEmployeeFile,
}: Props): JSX.Element {
  const descriptor = useMemo(
    () => CUSTODY_RETURN_TYPE_MAP[createdReturn.type],
    [createdReturn.type],
  )
  const canOpenEmployeeFile = createdReturn.employeeId !== null || createdReturn.employee !== null

  return (
    <section className="rounded-[18px] border border-ok-soft bg-ok-soft p-5">
      <header className="mb-4 flex items-center gap-2 text-ok">
        <Icon icon={CheckmarkCircle02Icon} size={18} />
        <h2 className="m-0 text-[14px] font-semibold">Devolución registrada</h2>
      </header>

      <div className="mb-4 rounded-[14px] border border-hairline bg-white px-4 py-3">
        <p className="m-0 text-[12px] text-muted">Folio de la devolución</p>
        <p className="m-0 font-mono text-[18px] font-semibold text-ink">{createdReturn.code}</p>
        <div className="mt-2">
          <Chip tone={descriptor.tone} size="sm" dot>
            {ReturnPresenter.typeLabel(createdReturn.type)}
          </Chip>
        </div>
        <p className="m-0 mt-2 text-[12px] text-ink-2">
          {ReturnPresenter.successSummary(createdReturn)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span title={SIGN_PENDING_TIP}>
          <Button variant="primary" icon={Task01Icon} disabled>
            Firmar hoja
          </Button>
        </span>
        <Button iconRight={ArrowRight01Icon} onClick={onViewCustody}>
          Volver al resguardo
        </Button>
        <Button
          variant="ghost"
          icon={UserSharingIcon}
          disabled={!canOpenEmployeeFile}
          onClick={onViewEmployeeFile}
        >
          Ir al expediente
        </Button>
      </div>
      <p className="m-0 mt-3 text-[11px] text-muted">{SIGN_PENDING_TIP}</p>
    </section>
  )
}
