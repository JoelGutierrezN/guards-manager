import type { EmployeeFormAction, EmployeeFormState } from './employee-form.model'

export function employeeFormReducer(
  state: EmployeeFormState,
  action: EmployeeFormAction,
): EmployeeFormState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.name }
    case 'SET_ROLE':
      return { ...state, roleId: action.roleId }
    case 'SET_EMAIL':
      return { ...state, email: action.email }
    case 'SET_PHONE':
      return { ...state, phone: action.phone }
    case 'ROLES_START':
      return { ...state, rolesStatus: 'loading' }
    case 'ROLES_SUCCESS':
      return { ...state, rolesStatus: 'ready', roles: action.roles }
    case 'ROLES_ERROR':
      return { ...state, rolesStatus: 'error', roles: [] }
    case 'TOUCH':
      return { ...state, touched: true }
    default:
      return state
  }
}
