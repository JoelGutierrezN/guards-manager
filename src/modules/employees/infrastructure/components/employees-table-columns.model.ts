export interface EmployeesTableColumn {
  key: string
  label: string
  widthClass?: string
}

export const EMPLOYEES_COLUMNS: EmployeesTableColumn[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'role', label: 'Rol', widthClass: 'w-37.5' },
  { key: 'active', label: 'Resguardos activos', widthClass: 'w-40' },
  { key: 'historical', label: 'Histórico', widthClass: 'w-30' },
  { key: 'hireDate', label: 'Fecha de alta', widthClass: 'w-37.5' },
  { key: 'actions', label: '', widthClass: 'w-22.5' },
]
