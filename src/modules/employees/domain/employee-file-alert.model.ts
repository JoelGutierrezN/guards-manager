export type EmployeeFileAlertType = 'inactivo_con_herramientas' | 'daño_reciente'

export interface EmployeeFileAlert {
  type: EmployeeFileAlertType
  message: string
  date: string
}
