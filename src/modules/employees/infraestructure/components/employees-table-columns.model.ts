export interface EmployeesTableColumn {
  key: string
  label: string
  widthClass?: string
}

export const EMPLOYEES_COLUMNS: EmployeesTableColumn[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'role', label: 'Rol', widthClass: 'w-32' },
  { key: 'contact', label: 'Contacto', widthClass: 'w-55' },
  { key: 'active', label: 'Resguardos activos', widthClass: 'w-40' },
  { key: 'historical', label: 'Histórico', widthClass: 'w-28' },
  { key: 'hireDate', label: 'Fecha de alta', widthClass: 'w-32' },
  { key: 'actions', label: '', widthClass: 'w-16' },
]
