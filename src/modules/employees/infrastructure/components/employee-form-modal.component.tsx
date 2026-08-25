import { type JSX } from 'react'
import {
  Cancel01Icon,
  InformationCircleIcon,
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
import type { Employee } from '../../domain/employee.entity'
import type { CreateEmployeeInput } from '../../domain/employee-input.model'
import { useEmployeeForm } from '../../hooks/use-employee-form.hook'
import { RoleSelect } from './role-select.component'

interface Props {
  open: boolean
  editEmployee: Employee | null
  saving: boolean
  formError: string | null
  onClose: () => void
  onSave: (input: CreateEmployeeInput) => void
}

export function EmployeeFormModal({
  open,
  editEmployee,
  saving,
  formError,
  onClose,
  onSave,
}: Props): JSX.Element {
  const isEdit = editEmployee != null
  const { state, visibleErrors, canSave, setName, setRole, setEmail, setPhone, submit } =
    useEmployeeForm({ enabled: open, editEmployee, onSave })

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
                {isEdit ? `Editar registro · ${editEmployee.identifier}` : 'Nuevo registro'}
              </div>
              <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
                {isEdit ? 'Editar empleado' : 'Crear empleado'}
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
            name="employee-name"
            autoComplete="off"
            leadIcon={UserIcon}
            placeholder="Ej. Ana Torres"
            value={state.name}
            error={visibleErrors.name != null}
            helpText={visibleErrors.name}
            autoFocus
            onChange={(event) => setName(event.target.value)}
          />

          <RoleSelect
            label="Rol"
            value={state.roleId}
            options={state.roles}
            status={state.rolesStatus}
            error={visibleErrors.roleId}
            onChange={setRole}
          />

          <Input
            label="Correo electrónico"
            hint="opcional"
            type="email"
            name="employee-email"
            autoComplete="off"
            leadIcon={Mail01Icon}
            placeholder="nombre@empresa.com"
            value={state.email}
            error={visibleErrors.email != null}
            helpText={visibleErrors.email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <Input
            label="Teléfono"
            hint="opcional"
            type="tel"
            name="employee-phone"
            autoComplete="off"
            inputMode="numeric"
            leadIcon={SmartPhone01Icon}
            placeholder="10 dígitos, ej. 5512345678"
            value={state.phone}
            error={visibleErrors.phone != null}
            helpText={visibleErrors.phone}
            onChange={(event) => setPhone(event.target.value)}
          />

          <div className="flex items-start gap-3 rounded-[10px] border border-lavender-line bg-lavender-bg p-2.5">
            <Icon icon={InformationCircleIcon} size={14} className="mt-0.5 shrink-0 text-brand" />
            <p className="text-[12px] text-ink-3">
              El <strong className="text-ink-2">correo</strong> y el{' '}
              <strong className="text-ink-2">teléfono</strong> podrían usarse a futuro. No son
              obligatorios, pero es recomendable que los ingreses.
            </p>
          </div>

          {formError != null && <span className="text-[12px] text-danger">{formError}</span>}
        </form>

        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!canSave || saving} onClick={submit}>
            {isEdit ? 'Guardar cambios' : 'Crear empleado'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
