export interface CreateEmployeeInput {
  name: string
  roleId: string
  email: string | null
  phone: string | null
}

export type UpdateEmployeeInput = CreateEmployeeInput
