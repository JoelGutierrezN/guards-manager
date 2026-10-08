import type { EmployeeEditAction, EmployeeEditState } from './employee-edit-state.model'

export function employeeEditReducer(
  state: EmployeeEditState,
  action: EmployeeEditAction,
): EmployeeEditState {
  switch (action.type) {
    case 'EDIT_OPENED':
      return { editingEmployee: action.employee, saving: false, formError: null }
    case 'SAVE_START':
      return { ...state, saving: true, formError: null }
    case 'SAVE_ERROR':
      return { ...state, saving: false, formError: action.message }
    case 'SAVE_DONE':
      return { ...state, saving: false, formError: null }
    default:
      return state
  }
}
