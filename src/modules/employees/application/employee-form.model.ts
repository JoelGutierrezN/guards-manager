import type { RoleOption } from '../domain/role-option.model'

export type RolesStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface EmployeeFormState {
  name: string
  roleId: string
  email: string
  phone: string
  roles: RoleOption[]
  rolesStatus: RolesStatus
  touched: boolean
}

export interface EmployeeFormErrors {
  name?: string
  roleId?: string
  email?: string
  phone?: string
}

export type EmployeeFormAction =
  | { type: 'SET_NAME'; name: string }
  | { type: 'SET_ROLE'; roleId: string }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_PHONE'; phone: string }
  | { type: 'ROLES_START' }
  | { type: 'ROLES_SUCCESS'; roles: RoleOption[] }
  | { type: 'ROLES_ERROR' }
  | { type: 'TOUCH' }
