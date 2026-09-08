import { type JSX } from 'react'
import { UserSearch01Icon } from '@hugeicons/core-free-icons'
import { Combobox, type ComboboxItem } from '../../../shared/infraestructure/components/ui'
import { useEmployeeOptions } from '../../hooks/use-employee-options.hook'

interface Props {
  employeeId: string
  employeeName: string
  onChange: (employeeId: string, employeeName: string) => void
}

export function CustodyEmployeeFilter({ employeeId, employeeName, onChange }: Props): JSX.Element {
  const { loadEmployeeOptions } = useEmployeeOptions()

  const handleChange = (item: ComboboxItem | null): void => {
    onChange(item?.value ?? '', item?.label ?? '')
  }

  return (
    <Combobox
      value={employeeId === '' ? null : employeeId}
      selectedLabel={employeeName === '' ? null : employeeName}
      onChange={handleChange}
      loadOptions={loadEmployeeOptions}
      leadIcon={UserSearch01Icon}
      placeholder="Buscar empleado…"
      emptyMessage="Sin empleados que coincidan"
      ariaLabel="Filtrar por empleado"
    />
  )
}
