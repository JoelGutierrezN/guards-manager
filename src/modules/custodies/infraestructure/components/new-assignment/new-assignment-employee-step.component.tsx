import { type JSX } from 'react'
import { UserSearch01Icon } from '@hugeicons/core-free-icons'
import {
  Combobox,
  FormField,
  Skeleton,
  type ComboboxItem,
  type ComboboxOptionsLoader,
} from '../../../../shared/infraestructure/components/ui'
import type { EmployeeOption } from '../../../domain/employee-option.model'
import { NewAssignmentEmployeeCard } from './new-assignment-employee-card.component'
import { NewAssignmentPanel } from './new-assignment-panel.component'

interface Props {
  employee: EmployeeOption | null
  isLoading: boolean
  errorMessage?: string
  loadOptions: ComboboxOptionsLoader
  onSelect: (item: ComboboxItem | null) => void
}

export function NewAssignmentEmployeeStep({
  employee,
  isLoading,
  errorMessage,
  loadOptions,
  onSelect,
}: Props): JSX.Element {
  return (
    <NewAssignmentPanel
      title="Empleado"
      hint="Solo aparecen empleados activos. Busca por nombre o identificador."
    >
      <div className="flex flex-col gap-3">
        <FormField
          label="Empleado que recibe"
          htmlFor="new-assignment-employee"
          error={errorMessage}
          required
        >
          <Combobox
            id="new-assignment-employee"
            ariaLabel="Buscar empleado"
            placeholder="Nombre o identificador…"
            emptyMessage="Sin empleados activos que coincidan"
            value={employee?.id ?? null}
            selectedLabel={employee?.name ?? null}
            loadOptions={loadOptions}
            onChange={onSelect}
            leadIcon={UserSearch01Icon}
            error={errorMessage !== undefined}
            disabled={isLoading}
          />
        </FormField>

        {isLoading && <Skeleton shape="block" height="66px" />}
        {!isLoading && employee !== null && <NewAssignmentEmployeeCard employee={employee} />}
        {!isLoading && employee === null && (
          <p className="m-0 text-[12px] text-muted">
            Elige un empleado para continuar con las unidades.
          </p>
        )}
      </div>
    </NewAssignmentPanel>
  )
}
