import type { JSX } from 'react'
import { Button } from '../../../shared/infraestructure/components/ui'
import type { SerialCorrection } from '../../domain/serial-correction.model'
import { StockUnitDateHelper } from '../helpers/stock-unit-date.helper'

interface Props {
  correction: SerialCorrection
  downloading: boolean
  downloadDisabled: boolean
  onDownload: (correction: SerialCorrection) => void
}

export function SerialCorrectionHistoryRow({
  correction,
  downloading,
  downloadDisabled,
  onDownload,
}: Props): JSX.Element {
  return (
    <li className="rounded-[16px] border border-hairline bg-cream px-4 py-3 text-[12px] text-ink-2">
      <p className="m-0 break-all font-mono font-medium text-ink">
        {correction.previousSerial ?? 'Sin serie'} → {correction.newSerial}
      </p>
      <p className="mb-0 mt-1 text-[11px] text-muted">
        {StockUnitDateHelper.format(correction.createdAt)} · {correction.createdBy.name}
      </p>
      {correction.reason !== null && (
        <p className="mb-0 mt-2 break-words">Motivo: {correction.reason}</p>
      )}
      {correction.responsible !== null && (
        <p className="mb-0 mt-2">
          Responsable: {correction.responsible.name} · {correction.responsible.identifier} ·{' '}
          {correction.custody?.code}
        </p>
      )}
      {correction.receipt !== null && (
        <Button
          size="sm"
          className="mt-3"
          disabled={downloadDisabled}
          onClick={() => onDownload(correction)}
        >
          {downloading ? 'Descargando…' : 'Reimprimir acuse'}
        </Button>
      )}
    </li>
  )
}
