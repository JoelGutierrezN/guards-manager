export interface Employee {
  id: string
  identifier: string
  name: string
  roleId: string
  roleName: string
  email: string | null
  phone: string | null
  activeToolsCount: number
  historicalToolsCount: number
  hireDate: string
  alertsCount: number
}
