import { type JSX } from 'react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { ConfirmDialog } from '../../../shared/infraestructure/components/ui'
import type { ApiConflictDetail } from '../../../shared/infraestructure/errors/api-conflict.model'
import { CustodyConflictNotice } from './custody-conflict-notice.component'

interface Props {
  open: boolean
  code: string
  loading: boolean
  error: ApiConflictDetail | null
  onConfirm: () => void
  onClose: () => void
}

export function CustodyCancelDialog({
  open,
  code,
  loading,
  error,
  onConfirm,
  onClose,
}: Props): JSX.Element {
  return (
    <ConfirmDialog
      open={open}
      eyebrow="Acción irreversible"
      title={`Cancelar el resguardo ${code}`}
      icon={Alert02Icon}
      destructive
      loading={loading}
      confirmLabel="Cancelar resguardo"
      cancelLabel="Volver"
      body={
        <>
          <p>
            Las unidades vuelven a quedar disponibles y el resguardo se marcará como cancelado. Solo
            se puede cancelar un resguardo activo y sin devoluciones registradas.
          </p>
          {error != null && <CustodyConflictNotice detail={error} />}
        </>
      }
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
