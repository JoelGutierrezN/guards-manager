import type { EmployeesAction, EmployeesState } from './employees-state.model.ts'

export function employeesReducer(state: EmployeesState, action: EmployeesAction): EmployeesState {
  switch (action.type) {
    case 'LOAD_START':
      return {
        ...state,
        loading: true,
      }
  }
}
