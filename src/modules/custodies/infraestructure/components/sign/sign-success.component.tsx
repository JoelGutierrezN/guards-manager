import { type JSX } from 'react'
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  Download01Icon,
  UserSharingIcon,
} from '@hugeicons/core-free-icons'
import { Button, Icon } from '../../../../shared/infraestructure/components/ui'

interface Props {
  title: string
  code: string
  message: string
  detail: string | null
  downloading: boolean
  canOpenEmployeeFile: boolean
  onDownload: () => void
  onViewEmployeeFile: () => void
  onViewCustody: () => void
}

const NO_EMPLOYEE_TIP = 'Este documento no tiene un empleado asociado.'

export function SignSuccess({
  title,
  code,
  message,
  detail,
  downloading,
  canOpenEmployeeFile,
  onDownload,
  onViewEmployeeFile,
  onViewCustody,
}: Props): JSX.Element {
  return (
    <section className="rounded-[18px] border border-ok-soft bg-ok-soft p-5">
      <header className="mb-4 flex items-center gap-2 text-ok">
        <Icon icon={CheckmarkCircle02Icon} size={18} />
        <h2 className="m-0 text-[14px] font-semibold">{title}</h2>
      </header>

      <div className="mb-4 rounded-[14px] border border-hairline bg-white px-4 py-3">
        <p className="m-0 text-[12px] text-muted">Folio del documento</p>
        <p className="m-0 font-mono text-[18px] font-semibold text-ink">{code}</p>
        <p className="m-0 mt-2 text-[12px] text-ink-2">{message}</p>
        {detail !== null && <p className="m-0 mt-1 text-[11px] text-muted">{detail}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" icon={Download01Icon} disabled={downloading} onClick={onDownload}>
          {downloading ? 'Descargando…' : 'Descargar hoja'}
        </Button>
        <Button
          icon={UserSharingIcon}
          disabled={!canOpenEmployeeFile}
          tip={canOpenEmployeeFile ? undefined : NO_EMPLOYEE_TIP}
          onClick={onViewEmployeeFile}
        >
          Ver documento en expediente
        </Button>
        <Button variant="ghost" iconRight={ArrowRight01Icon} onClick={onViewCustody}>
          Volver al resguardo
        </Button>
      </div>
    </section>
  )
}
