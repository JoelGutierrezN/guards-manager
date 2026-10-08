import {
  INITIAL_EMPLOYEE_LIFECYCLE_STATE,
  type EmployeeLifecycleAction,
  type EmployeeLifecycleState,
} from './employee-lifecycle-state.model'

export function employeeLifecycleReducer(
  state: EmployeeLifecycleState,
  action: EmployeeLifecycleAction,
): EmployeeLifecycleState {
  switch (action.type) {
    case 'OPEN_CONFIRM':
      return {
        target: action.target,
        confirmKind: action.kind,
        loading: false,
        errorMessage: null,
      }
    case 'CLOSE_CONFIRM':
      return INITIAL_EMPLOYEE_LIFECYCLE_STATE
    case 'ACTION_START':
      return { ...state, loading: true, errorMessage: null }
    case 'ACTION_SUCCESS':
      return INITIAL_EMPLOYEE_LIFECYCLE_STATE
    case 'ACTION_ERROR':
      return { ...state, loading: false, errorMessage: action.message }
    default:
      return state
  }
}
