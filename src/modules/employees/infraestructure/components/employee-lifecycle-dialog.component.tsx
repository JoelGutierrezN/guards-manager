import { type JSX } from 'react'
import { ConfirmDialog } from '../../../shared/infraestructure/components/ui'
import type {
  EmployeeLifecycleConfirmKind,
  EmployeeLifecycleTarget,
} from '../../application/employee-lifecycle-state.model'
import { EmployeeLifecycleTextsHelper } from '../../application/employee-lifecycle-texts.helper'

interface Props {
  target: EmployeeLifecycleTarget | null
  confirmKind: EmployeeLifecycleConfirmKind | null
  loading: boolean
  errorMessage: string | null
  onConfirm: () => void
  onClose: () => void
}

export function EmployeeLifecycleDialog({
  target,
  confirmKind,
  loading,
  errorMessage,
  onConfirm,
  onClose,
}: Props): JSX.Element {
  if (target === null || confirmKind === null) return <></>

  return (
    <ConfirmDialog
      open
      title={EmployeeLifecycleTextsHelper.title(target, confirmKind)}
      eyebrow={EmployeeLifecycleTextsHelper.eyebrow(confirmKind)}
      body={errorMessage ?? EmployeeLifecycleTextsHelper.body(target, confirmKind)}
      confirmLabel={EmployeeLifecycleTextsHelper.confirmLabel(target, confirmKind)}
      destructive={confirmKind === 'delete'}
      loading={loading}
      onConfirm={onConfirm}
      onClose={onClose}
    />
  )
}
