import { type JSX } from 'react'
import { Chip } from '../../../../shared/infraestructure/components/ui'
import type { SignDocument } from '../../../domain/sign-document.model'
import { SignPresenter } from '../../../application/sign-presenter.helper'
import { SignDocumentItemRow } from './sign-document-item-row.component'

interface Props {
  signDocument: SignDocument
}

export function SignDocumentCard({ signDocument }: Props): JSX.Element {
  return (
    <section className="rounded-[18px] border border-hairline bg-white p-4 shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <header className="mb-3 flex items-center justify-between gap-2">
        <h2 className="m-0 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
          Documento
        </h2>
        <Chip tone="navy" size="sm">
          {SignPresenter.typeLabel(signDocument.type)}
        </Chip>
      </header>

      <p className="m-0 font-mono text-[18px] font-semibold text-ink">{signDocument.code}</p>
      <p className="m-0 mt-1 text-[12px] text-ink-2">
        {SignPresenter.documentSummary(signDocument)}
      </p>

      <div className="mt-3 rounded-[12px] bg-cream px-3 py-2.5">
        <p className="m-0 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
          Empleado
        </p>
        <p className="m-0 mt-1 text-[13px] font-medium text-ink">
          {signDocument.employeeName === '' ? 'Sin empleado' : signDocument.employeeName}
        </p>
        <p className="m-0 font-mono text-[11px] text-muted">{signDocument.employeeIdentifier}</p>
      </div>

      {signDocument.items.length > 0 && (
        <ul className="mt-3">
          {signDocument.items.map((item) => (
            <SignDocumentItemRow key={item.id} item={item} />
          ))}
        </ul>
      )}

      {signDocument.notes != null && signDocument.notes !== '' && (
        <div className="mt-3 rounded-[12px] bg-cream px-3 py-2.5">
          <p className="m-0 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
            Notas
          </p>
          <p className="m-0 mt-1 text-[12px] leading-[1.5] text-ink-2">{signDocument.notes}</p>
        </div>
      )}
    </section>
  )
}
