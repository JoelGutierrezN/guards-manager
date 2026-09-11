import { type JSX } from 'react'
import {
  Cancel01Icon,
  Key01Icon,
  Mail01Icon,
  SmartPhone01Icon,
  UserAdd01Icon,
  UserEdit01Icon,
  UserIcon,
} from '@hugeicons/core-free-icons'
import {
  Button,
  Icon,
  IconButton,
  Input,
  Modal,
} from '../../../shared/infraestructure/components/ui'
import type { User } from '../../domain/user.entity'
import type { UserFormErrors } from '../../application/user-form.model'
import type { CreateUserInput, UpdateUserInput } from '../../domain/user-input.model'
import { useUserForm } from '../../hooks/use-user-form.hook'

interface Props {
  open: boolean
  editUser: User | null
  saving: boolean
  formError: string | null
  formErrors: UserFormErrors
  onClose: () => void
  onSave: (input: CreateUserInput | UpdateUserInput) => void
}

export function UserFormModal({
  open,
  editUser,
  saving,
  formError,
  formErrors,
  onClose,
  onSave,
}: Props): JSX.Element {
  const isEdit = editUser != null
  const { state, visibleErrors, setName, setEmail, setUsername, setPhone, setPassword, submit } =
    useUserForm({ editUser, apiErrors: formErrors, onSave })

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-brand text-white shadow-[0_8px_18px_-8px_var(--color-brand)]">
              <Icon icon={isEdit ? UserEdit01Icon : UserAdd01Icon} size={20} strokeWidth={1.7} />
            </span>
            <div>
              <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-brand uppercase">
                {isEdit ? `Editar registro · ${editUser.username}` : 'Nuevo registro'}
              </div>
              <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
                {isEdit ? 'Editar usuario' : 'Crear usuario'}
              </div>
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        <form
          className="flex flex-col gap-4"
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault()
            submit()
          }}
        >
          <Input
            label="Nombre completo *"
            name="user-name"
            aria-label="Nombre completo"
            autoComplete="off"
            leadIcon={UserIcon}
            placeholder="Ej. Ana Torres"
            value={state.name}
            error={visibleErrors.name != null}
            helpText={visibleErrors.name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Usuario *"
              name="user-username"
              aria-label="Usuario"
              autoComplete="off"
              leadIcon={UserIcon}
              placeholder="ana.torres"
              value={state.username}
              error={visibleErrors.username != null}
              helpText={visibleErrors.username}
              onChange={(event) => setUsername(event.target.value)}
            />

            <Input
              label="Correo electrónico *"
              type="email"
              name="user-email"
              aria-label="Correo electrónico"
              autoComplete="off"
              leadIcon={Mail01Icon}
              placeholder="nombre@empresa.com"
              value={state.email}
              error={visibleErrors.email != null}
              helpText={visibleErrors.email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Teléfono"
              hint="opcional"
              type="tel"
              name="user-phone"
              aria-label="Teléfono"
              autoComplete="off"
              inputMode="numeric"
              leadIcon={SmartPhone01Icon}
              placeholder="10 dígitos, ej. 5512345678"
              value={state.phone}
              error={visibleErrors.phone != null}
              helpText={visibleErrors.phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <Input
              label={isEdit ? 'Contraseña' : 'Contraseña *'}
              hint={isEdit ? 'dejar en blanco para no cambiarla' : undefined}
              type="password"
              name="user-password"
              aria-label="Contraseña"
              autoComplete="new-password"
              leadIcon={Key01Icon}
              placeholder="Mínimo 8 caracteres"
              value={state.password}
              error={visibleErrors.password != null}
              helpText={visibleErrors.password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          {formError != null && (
            <span className="text-[12px] text-danger" role="alert">
              {formError}
            </span>
          )}

          <div className="mt-[18px] flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {isEdit ? 'Guardar cambios' : 'Crear usuario'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}
