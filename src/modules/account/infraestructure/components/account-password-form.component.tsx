import { type JSX } from 'react'
import { LockIcon } from '@hugeicons/core-free-icons'
import { Button, FormField, Input } from '../../../shared/infraestructure/components/ui'
import { useAccountPasswordForm } from '../../hooks/use-account-password-form.hook'

interface Props {
  onNotify: (message: string) => void
}

export function AccountPasswordForm({ onNotify }: Props): JSX.Element {
  const {
    state,
    visibleErrors,
    canSave,
    setCurrentPassword,
    setPassword,
    setPasswordConfirmation,
    submit,
  } = useAccountPasswordForm({
    onSaved: () => onNotify('Contraseña actualizada.'),
  })

  return (
    <form
      className="flex flex-col gap-4"
      autoComplete="off"
      onSubmit={(event) => {
        event.preventDefault()
        void submit()
      }}
    >
      <FormField label="Contraseña actual" required error={visibleErrors.currentPassword}>
        <Input
          aria-label="Contraseña actual"
          type="password"
          leadIcon={LockIcon}
          autoComplete="current-password"
          value={state.currentPassword}
          error={visibleErrors.currentPassword !== undefined}
          onChange={(event) => setCurrentPassword(event.target.value)}
        />
      </FormField>

      <FormField label="Contraseña nueva" required error={visibleErrors.password}>
        <Input
          aria-label="Contraseña nueva"
          type="password"
          leadIcon={LockIcon}
          autoComplete="new-password"
          value={state.password}
          error={visibleErrors.password !== undefined}
          onChange={(event) => setPassword(event.target.value)}
        />
      </FormField>

      <FormField
        label="Confirmar contraseña nueva"
        required
        error={visibleErrors.passwordConfirmation}
      >
        <Input
          aria-label="Confirmar contraseña nueva"
          type="password"
          leadIcon={LockIcon}
          autoComplete="new-password"
          value={state.passwordConfirmation}
          error={visibleErrors.passwordConfirmation !== undefined}
          onChange={(event) => setPasswordConfirmation(event.target.value)}
        />
      </FormField>

      {state.apiMessage !== null && (
        <p className="text-[12px] text-danger" role="alert">
          {state.apiMessage}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={!canSave}>
          {state.isSaving ? 'Guardando...' : 'Cambiar contraseña'}
        </Button>
      </div>
    </form>
  )
}
