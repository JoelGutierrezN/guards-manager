import type { FilterStateOptionItem } from '../../shared/infraestructure/components/ui'
import type { EmployeeStatus } from './employee-status.model'

export type EmployeeStatusFilter = 'todos' | EmployeeStatus

export interface EmployeesFilters {
  status: EmployeeStatusFilter
  roleIds: string[]
  withTools: boolean
  hiredFrom: string
  hiredTo: string
}

export const INITIAL_EMPLOYEES_FILTERS: EmployeesFilters = {
  status: 'todos',
  roleIds: [],
  withTools: false,
  hiredFrom: '',
  hiredTo: '',
}

export type EmployeeStatusOption = FilterStateOptionItem<EmployeeStatusFilter>

export const EMPLOYEE_STATUS_OPTIONS: EmployeeStatusOption[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'inactivo', label: 'Inactivos' },
]

export const EMPLOYEE_STATUS_FILTER_VALUES: EmployeeStatusFilter[] = EMPLOYEE_STATUS_OPTIONS.map(
  (option) => option.value,
)
