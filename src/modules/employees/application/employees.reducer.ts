import type { EmployeesAction, EmployeesState } from './employees-state.model'
import { INITIAL_EMPLOYEES_FILTERS } from '../domain/employees-filters.model'

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
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.filters }, page: 1 }
    case 'CLEAR_FILTERS':
      return { ...state, filters: INITIAL_EMPLOYEES_FILTERS, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    case 'SAVE_START':
      return { ...state, saving: true, formError: null }
    case 'SAVE_ERROR':
      return { ...state, saving: false, formError: action.message }
    case 'SAVE_DONE':
      return { ...state, saving: false, formError: null }
    case 'ROW_ADDED': {
      const total = state.total + 1
      return {
        ...state,
        rows: [action.employee, ...state.rows].slice(0, state.perPage),
        total,
        lastPage: Math.max(1, Math.ceil(total / state.perPage)),
        stats:
          state.stats == null
            ? state.stats
            : { ...state.stats, totalEmployees: state.stats.totalEmployees + 1 },
      }
    }
    case 'ROW_UPDATED': {
      const { employee } = action
      return {
        ...state,
        rows: state.rows.map((row) =>
          row.id === employee.id
            ? {
                ...row,
                name: employee.name,
                roleId: employee.roleId,
                roleName: employee.roleName,
                email: employee.email,
                phone: employee.phone,
                status: employee.status,
              }
            : row,
        ),
      }
    }
    default:
      return state
  }
}
