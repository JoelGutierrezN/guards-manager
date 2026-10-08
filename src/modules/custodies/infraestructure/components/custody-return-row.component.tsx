import { type JSX, useCallback } from 'react'
import { Download01Icon, SignatureIcon } from '@hugeicons/core-free-icons'
import { Button, Chip } from '../../../shared/infraestructure/components/ui'
import type { CustodyReturnSummary } from '../../domain/custody.entity'
import { CUSTODY_RETURN_TYPE_MAP } from '../../domain/custody-return-type.model'
import { CustodyPresenter } from '../../application/custody-presenter.helper'
import { CustodyDateHelper } from '../../application/custody-date.helper'
import { CustodySignatureChip } from './custody-signature-chip.component'

interface Props {
  entry: CustodyReturnSummary
  downloading: boolean
  onSign: (entry: CustodyReturnSummary) => void
  onDownloadSheet: (entry: CustodyReturnSummary) => void
}

const DRAFT_SHEET_TIP = 'Sin firma se descarga un borrador con la marca «SIN FIRMA»'

export function CustodyReturnRow({
  entry,
  downloading,
  onSign,
  onDownloadSheet,
}: Props): JSX.Element {
  const typeDescriptor = CUSTODY_RETURN_TYPE_MAP[entry.type]
  const isSigned = entry.signedAt !== null

  const handleSign = useCallback((): void => onSign(entry), [onSign, entry])
  const handleDownload = useCallback((): void => onDownloadSheet(entry), [onDownloadSheet, entry])

  return (
    <li className="flex items-start gap-3 border-b border-hairline px-4 py-3 last:border-b-0">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ok" />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[12px] font-semibold text-ink">{entry.code}</span>
          <Chip tone={typeDescriptor.tone} size="sm">
            {typeDescriptor.label}
          </Chip>
          <span className="text-[12px] text-muted">
            {CustodyPresenter.quantityText(entry.itemsCount, 'unidad', 'unidades')}
          </span>
          <CustodySignatureChip signedAt={entry.signedAt} />
        </div>
        <span className="text-[12px] text-ink-3">
          {CustodyDateHelper.dateTime(entry.createdAt)}
          {entry.receivedBy != null && ` · Recibió ${entry.receivedBy.name}`}
        </span>
        {entry.notes != null && entry.notes !== '' && (
          <span className="text-[12px] text-muted">{entry.notes}</span>
        )}
        <div className="mt-1 flex flex-wrap items-center gap-2">
          {!isSigned && (
            <Button
              variant="ghost"
              size="sm"
              icon={SignatureIcon}
              aria-label={`Firmar la devolución ${entry.code}`}
              onClick={handleSign}
            >
              Firmar hoja
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon={Download01Icon}
            disabled={downloading}
            tip={isSigned ? undefined : DRAFT_SHEET_TIP}
            aria-label={`Descargar la hoja de la devolución ${entry.code}`}
            onClick={handleDownload}
          >
            Descargar hoja
          </Button>
        </div>
      </div>
    </li>
  )
}
