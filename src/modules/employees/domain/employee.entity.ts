import type { EmployeeStatus } from './employee-status.model'

export interface Employee {
  id: string
  identifier: string
  name: string
  roleId: string
  roleName: string
  email: string | null
  phone: string | null
  status: EmployeeStatus
  activeToolsCount: number
  historicalToolsCount: number
  hireDate: string
  alertsCount: number
}
