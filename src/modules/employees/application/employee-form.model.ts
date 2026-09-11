import type { RoleOption } from '../domain/role-option.model'
import type { EmployeeStatus } from '../domain/employee-status.model'

export type RolesStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface EmployeeFormState {
  name: string
  roleId: string
  email: string
  phone: string
  hiredAt: string
  status: EmployeeStatus
  roles: RoleOption[]
  rolesStatus: RolesStatus
  roleCreating: boolean
  roleCreateError: string | null
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
  | { type: 'SET_HIRED_AT'; hiredAt: string }
  | { type: 'SET_STATUS'; status: EmployeeStatus }
  | { type: 'ROLES_START' }
  | { type: 'ROLES_SUCCESS'; roles: RoleOption[] }
  | { type: 'ROLES_ERROR' }
  | { type: 'ROLE_CREATE_START' }
  | { type: 'ROLE_CREATE_SUCCESS'; role: RoleOption }
  | { type: 'ROLE_CREATE_ERROR'; message: string }
  | { type: 'TOUCH' }
