import type { EmployeeStatus } from '../domain/employee-status.model'

export type EmployeeLifecycleConfirmKind = 'status' | 'delete'

/** Datos mínimos que el diálogo y la llamada al API necesitan del empleado señalado.
 *  Tanto `Employee` como `EmployeeFileProfile` lo satisfacen sin conversión. */
export interface EmployeeLifecycleTarget {
  id: string
  name: string
  status: EmployeeStatus
}

export interface EmployeeLifecycleState {
  target: EmployeeLifecycleTarget | null
  confirmKind: EmployeeLifecycleConfirmKind | null
  loading: boolean
  errorMessage: string | null
}

export const INITIAL_EMPLOYEE_LIFECYCLE_STATE: EmployeeLifecycleState = {
  target: null,
  confirmKind: null,
  loading: false,
  errorMessage: null,
}

export type EmployeeLifecycleAction =
  | { type: 'OPEN_CONFIRM'; kind: EmployeeLifecycleConfirmKind; target: EmployeeLifecycleTarget }
  | { type: 'CLOSE_CONFIRM' }
  | { type: 'ACTION_START' }
  | { type: 'ACTION_SUCCESS' }
  | { type: 'ACTION_ERROR'; message: string }
