import { type JSX } from 'react'
import type { CustodyDetail } from '../../domain/custody.entity'
import { CustodyDateHelper } from '../helpers/custody-date.helper'
import { CustodySignatureChip } from './custody-signature-chip.component'
import { CustodyStatusChip } from './custody-status-chip.component'
import { CustodySummaryRow } from './custody-summary-row.component'

interface Props {
  custody: CustodyDetail
}

export function CustodySummaryCard({ custody }: Props): JSX.Element {
  const returnedCount = custody.itemsCount - custody.pendingItemsCount

  return (
    <section className="rounded-[18px] border border-hairline bg-white p-4 shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <h2 className="mb-2 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
        Resumen
      </h2>
      <dl>
        <CustodySummaryRow label="Estado">
          <CustodyStatusChip status={custody.status} size="md" />
        </CustodySummaryRow>
        <CustodySummaryRow label="Unidades">{custody.itemsCount}</CustodySummaryRow>
        <CustodySummaryRow label="Devueltas">{returnedCount}</CustodySummaryRow>
        <CustodySummaryRow label="Pendientes">{custody.pendingItemsCount}</CustodySummaryRow>
        <CustodySummaryRow label="Firma">
          <CustodySignatureChip signedAt={custody.signedAt} />
        </CustodySummaryRow>
        <CustodySummaryRow label="Registrado">
          {CustodyDateHelper.dateTime(custody.createdAt)}
        </CustodySummaryRow>
        <CustodySummaryRow label="Registró">{custody.createdBy?.name ?? '—'}</CustodySummaryRow>
      </dl>

      {custody.notes != null && custody.notes !== '' && (
        <div className="mt-3 rounded-[12px] bg-cream px-3 py-2.5">
          <p className="mb-1 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
            Notas
          </p>
          <p className="text-[12px] leading-[1.5] text-ink-2">{custody.notes}</p>
        </div>
      )}
    </section>
  )
}
