import type { EmployeesAction, EmployeesState } from './employees-state.model'

export function employeesReducer(state: EmployeesState, action: EmployeesAction): EmployeesState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        rows: action.result.employees,
        page: action.result.page,
        perPage: action.result.perPage,
        lastPage: action.result.lastPage,
        total: action.result.total,
        stats: action.result.stats,
        status: 'ready',
        error: null,
      }
    case 'LOAD_ERROR':
      return { ...state, status: 'error', error: action.error }
    case 'SET_QUERY':
      return { ...state, query: action.query, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    default:
      return state
  }
}
