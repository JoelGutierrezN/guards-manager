import type { Employee } from '../domain/employee.entity'

export interface EmployeeEditState {
  editingEmployee: Employee | null
  saving: boolean
  formError: string | null
}

export const INITIAL_EMPLOYEE_EDIT_STATE: EmployeeEditState = {
  editingEmployee: null,
  saving: false,
  formError: null,
}

export type EmployeeEditAction =
  | { type: 'EDIT_OPENED'; employee: Employee }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_ERROR'; message: string }
  | { type: 'SAVE_DONE' }
