export type EmployeeLifecycleConfirmKind = 'status' | 'delete'

export interface EmployeeLifecycleState {
  confirmKind: EmployeeLifecycleConfirmKind | null
  loading: boolean
  errorMessage: string | null
}

export const INITIAL_EMPLOYEE_LIFECYCLE_STATE: EmployeeLifecycleState = {
  confirmKind: null,
  loading: false,
  errorMessage: null,
}

export type EmployeeLifecycleAction =
  | { type: 'OPEN_CONFIRM'; kind: EmployeeLifecycleConfirmKind }
  | { type: 'CLOSE_CONFIRM' }
  | { type: 'ACTION_START' }
  | { type: 'ACTION_SUCCESS' }
  | { type: 'ACTION_ERROR'; message: string }
