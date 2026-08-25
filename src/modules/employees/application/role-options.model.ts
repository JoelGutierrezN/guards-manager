import type { RoleOption } from '../domain/role-option.model'
import type { RolesStatus } from './employee-form.model'

export interface RoleOptionsState {
  roles: RoleOption[]
  status: RolesStatus
}

export const INITIAL_ROLE_OPTIONS_STATE: RoleOptionsState = { roles: [], status: 'idle' }

export type RoleOptionsAction =
  { type: 'ROLES_START' } | { type: 'ROLES_SUCCESS'; roles: RoleOption[] } | { type: 'ROLES_ERROR' }
