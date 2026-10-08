import { type JSX, useMemo } from 'react'
import { Download01Icon, File01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileSizeHelper } from '../../../shared/application/file-size.helper'
import { Button, Chip, type ChipTone } from '../../../shared/infraestructure/components/ui'
import { CustodyDateHelper } from '../../../custodies/application/custody-date.helper'
import type { EmployeeFileDocument } from '../../domain/employee-file-document.model'
import { EmployeeFileDocumentHelper } from '../helpers/employee-file-document.helper'

interface Props {
  document: EmployeeFileDocument
  onDownload: (document: EmployeeFileDocument) => void
}

const CHIP_TONES: Record<EmployeeFileDocument['type'], ChipTone> = {
  resguardo: 'navy',
  devolucion: 'ok',
}

export function EmployeeFileDocumentCard({ document, onDownload }: Props): JSX.Element {
  const chipTone = useMemo(() => CHIP_TONES[document.type], [document.type])

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-hairline bg-paper-tint px-3.5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink-3">
          <HugeiconsIcon icon={File01Icon} size={16} strokeWidth={1.8} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Chip tone={chipTone} size="sm">
              {EmployeeFileDocumentHelper.typeLabel(document.type)}
            </Chip>
            <span className="font-mono text-[11px] text-muted">{document.code}</span>
          </div>
          <div className="mt-0.5 truncate text-[12px] font-medium text-ink">{document.title}</div>
          <div className="font-mono text-[11px] text-muted">
            {CustodyDateHelper.date(document.createdAt)} ·{' '}
            {FileSizeHelper.label(document.sizeBytes)}
          </div>
        </div>
      </div>
      <Button icon={Download01Icon} size="sm" onClick={() => onDownload(document)}>
        Descargar
      </Button>
    </div>
  )
}
