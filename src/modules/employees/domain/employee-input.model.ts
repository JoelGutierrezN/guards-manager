import type { EmployeeStatus } from './employee-status.model'

export interface CreateEmployeeInput {
  name: string
  roleId: string
  email: string | null
  phone: string | null
  hiredAt: string | null
  status: EmployeeStatus
}

export type UpdateEmployeeInput = CreateEmployeeInput
