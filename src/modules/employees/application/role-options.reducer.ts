import type { RoleOptionsAction, RoleOptionsState } from './role-options.model'

export function roleOptionsReducer(
  state: RoleOptionsState,
  action: RoleOptionsAction,
): RoleOptionsState {
  switch (action.type) {
    case 'ROLES_START':
      return { ...state, status: 'loading' }
    case 'ROLES_SUCCESS':
      return { roles: action.roles, status: 'ready' }
    case 'ROLES_ERROR':
      return { ...state, status: 'error' }
    default:
      return state
  }
}
