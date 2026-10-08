import { type JSX } from 'react'
import { Mail01Icon, SmartPhone01Icon, UserIcon } from '@hugeicons/core-free-icons'
import { Button, FormField, Input } from '../../../shared/infraestructure/components/ui'
import type { AccountProfile } from '../../domain/account-profile.model'
import { useAccountProfileForm } from '../../hooks/use-account-profile-form.hook'

interface Props {
  profile: AccountProfile
  onSaved: (profile: AccountProfile) => void
  onNotify: (message: string) => void
}

export function AccountProfileForm({ profile, onSaved, onNotify }: Props): JSX.Element {
  const { state, visibleErrors, setName, setEmail, setUsername, setPhone, submit } =
    useAccountProfileForm({
      profile,
      onSaved: (updatedProfile) => {
        onNotify('Perfil actualizado.')
        onSaved(updatedProfile)
      },
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
      <FormField label="Nombre completo" required error={visibleErrors.name}>
        <Input
          aria-label="Nombre completo"
          leadIcon={UserIcon}
          autoComplete="off"
          value={state.name}
          error={visibleErrors.name !== undefined}
          onChange={(event) => setName(event.target.value)}
        />
      </FormField>

      <FormField label="Usuario" required error={visibleErrors.username}>
        <Input
          aria-label="Usuario"
          leadIcon={UserIcon}
          autoComplete="off"
          value={state.username}
          error={visibleErrors.username !== undefined}
          onChange={(event) => setUsername(event.target.value)}
        />
      </FormField>

      <FormField label="Correo electrónico" required error={visibleErrors.email}>
        <Input
          aria-label="Correo electrónico"
          type="email"
          leadIcon={Mail01Icon}
          autoComplete="off"
          value={state.email}
          error={visibleErrors.email !== undefined}
          onChange={(event) => setEmail(event.target.value)}
        />
      </FormField>

      <FormField label="Teléfono" hint="opcional" error={visibleErrors.phone}>
        <Input
          aria-label="Teléfono"
          type="tel"
          inputMode="numeric"
          leadIcon={SmartPhone01Icon}
          autoComplete="off"
          value={state.phone}
          error={visibleErrors.phone !== undefined}
          onChange={(event) => setPhone(event.target.value)}
        />
      </FormField>

      {state.apiMessage !== null && (
        <p className="text-[12px] text-danger" role="alert">
          {state.apiMessage}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" variant="primary" disabled={state.isSaving}>
          {state.isSaving ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  )
}
