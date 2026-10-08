import { type JSX } from 'react'
import { ConfirmDialog } from '../../../shared/infraestructure/components/ui'
import type { UserDeleteTarget } from '../../application/user-delete-state.model'

interface Props {
  target: UserDeleteTarget | null
  loading: boolean
  errorMessage: string | null
  onConfirm: () => void
  onClose: () => void
}

export function UserDeleteDialog({
  target,
  loading,
  errorMessage,
  onConfirm,
  onClose,
}: Props): JSX.Element {
  if (target === null) return <></>

  return (
    <ConfirmDialog
      open
      title={`Eliminar a ${target.name}`}
      eyebrow="Usuarios"
      body={errorMessage ?? 'Esta acción no se puede deshacer. El usuario perderá el acceso.'}
      confirmLabel="Eliminar"
      destructive
      loading={loading}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
