import { type JSX, useMemo } from 'react'
import { Chip } from '../../../../shared/infraestructure/components/ui'
import { CUSTODY_RETURN_TYPE_MAP } from '../../../domain/custody-return-type.model'
import type { CustodyReturnType } from '../../../domain/custody-return-type.model'
import type { CustodyEmployee } from '../../../domain/custody.entity'
import { ReturnPresenter } from '../../../application/return-presenter.helper'

interface Props {
  employee: CustodyEmployee
  custodyCode: string
  previewType: CustodyReturnType
  selectedCount: number
  pendingCount: number
}

export function ReturnSummaryCard({
  employee,
  custodyCode,
  previewType,
  selectedCount,
  pendingCount,
}: Props): JSX.Element {
  const descriptor = useMemo(() => CUSTODY_RETURN_TYPE_MAP[previewType], [previewType])

  return (
    <section className="flex flex-col gap-3 rounded-[18px] border border-hairline bg-white p-4">
      <header>
        <p className="m-0 text-[11px] font-semibold tracking-[0.08em] text-muted uppercase">
          Vista previa
        </p>
        <h2 className="m-0 mt-1 text-[14px] font-semibold text-ink">Devolución por registrar</h2>
      </header>

      <div>
        <Chip tone={descriptor.tone} size="sm" dot>
          {descriptor.label}
        </Chip>
        <p className="m-0 mt-2 text-[12px] text-ink-2">
          {ReturnPresenter.previewText(selectedCount, pendingCount)}
        </p>
      </div>

      <dl className="m-0 grid gap-2 border-t border-hairline pt-3 text-[12px]">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="m-0 text-muted">Resguardo</dt>
          <dd className="m-0 font-mono text-[12px] font-semibold text-ink">{custodyCode}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="m-0 text-muted">Empleado</dt>
          <dd className="m-0 truncate text-right text-ink-2">{employee.name}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="m-0 text-muted">Identificador</dt>
          <dd className="m-0 font-mono text-[12px] text-ink-2">{employee.identifier}</dd>
        </div>
      </dl>

      <p className="m-0 text-[11px] text-muted">
        El tipo definitivo lo confirma el servidor al guardar la devolución.
      </p>
    </section>
  )
}
