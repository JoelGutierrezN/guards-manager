import { INITIAL_CUSTODIES_FILTERS, type CustodiesFilters } from '../domain/custodies-filters.model'
import type { CustodiesListPage } from '../domain/custodies-list-page.model'
import type { CustodiesAction, CustodiesState } from './custodies-state.model'

/** Al llegar por URL con `employee` solo se conoce el id: el nombre se toma de las filas. */
function filtersWithEmployeeName(
  filters: CustodiesFilters,
  result: CustodiesListPage,
): CustodiesFilters {
  if (filters.employeeId === '' || filters.employeeName !== '') return filters
  const [firstRow] = result.custodies
  if (firstRow == null || firstRow.employee.id !== filters.employeeId) return filters
  return { ...filters, employeeName: firstRow.employee.name }
}

export function custodiesReducer(state: CustodiesState, action: CustodiesAction): CustodiesState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, status: 'loading', error: null }
    case 'LOAD_SUCCESS':
      return {
        ...state,
        rows: action.result.custodies,
        page: action.result.page,
        perPage: action.result.perPage,
        lastPage: action.result.lastPage,
        total: action.result.total,
        stats: action.result.stats,
        filters: filtersWithEmployeeName(state.filters, action.result),
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
      return { ...state, filters: INITIAL_CUSTODIES_FILTERS, page: 1 }
    case 'SET_PAGE':
      return { ...state, page: action.page }
    default:
      return state
  }
}
