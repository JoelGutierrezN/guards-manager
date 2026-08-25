import type { QueryParams, QueryParamValue } from '../../../shared/hooks/query-params.model'
import {
  INITIAL_EMPLOYEES_STATE,
  type EmployeesState,
} from '../../application/employees-state.model'
import {
  EMPLOYEE_STATUS_FILTER_VALUES,
  type EmployeeStatusFilter,
  type EmployeesFilters,
} from '../../domain/employees-filters.model'

export interface EmployeesListRequest {
  page: number
  query: string
  filters: EmployeesFilters
}

const IDENTIFIER_PATTERN = /^ett-?\d*$/i
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export class EmployeeQueryParamsHelper {
  static initialStateFrom(params: QueryParams): EmployeesState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const query = params.q === undefined || params.q === null ? '' : String(params.q)
    const filters: EmployeesFilters = {
      status: EmployeeQueryParamsHelper.statusFrom(params.status),
      roleIds: EmployeeQueryParamsHelper.listFrom(params.roles),
      withTools: EmployeeQueryParamsHelper.flagFrom(params['with-tools']),
      hiredFrom: EmployeeQueryParamsHelper.dateFrom(params['hired-from']),
      hiredTo: EmployeeQueryParamsHelper.dateFrom(params['hired-to']),
    }
    return { ...INITIAL_EMPLOYEES_STATE, page, query, filters }
  }

  static toParams(state: Pick<EmployeesState, 'page' | 'query' | 'filters'>): QueryParams {
    const { page, query, filters } = state
    return {
      page: page > 1 ? page : undefined,
      q: query !== '' ? query : undefined,
      status: filters.status !== 'todos' ? filters.status : undefined,
      roles: filters.roleIds.length > 0 ? filters.roleIds.join(',') : undefined,
      'with-tools': filters.withTools ? true : undefined,
      'hired-from': filters.hiredFrom !== '' ? filters.hiredFrom : undefined,
      'hired-to': filters.hiredTo !== '' ? filters.hiredTo : undefined,
    }
  }

  static toApiParams(request: EmployeesListRequest): URLSearchParams {
    const params = new URLSearchParams({ page: String(request.page) })
    EmployeeQueryParamsHelper.appendFilters(params, request)
    return params
  }

  /** El export ignora la paginación: devuelve todas las filas que casan con los filtros. */
  static toExportParams(request: EmployeesListRequest): URLSearchParams {
    const params = new URLSearchParams()
    EmployeeQueryParamsHelper.appendFilters(params, request)
    return params
  }

  private static appendFilters(params: URLSearchParams, request: EmployeesListRequest): void {
    const { filters } = request
    const query = request.query.trim()

    if (query !== '') {
      const searchKey = IDENTIFIER_PATTERN.test(query) ? 'identifier' : 'name'
      params.set(searchKey, query)
    }
    if (filters.status !== 'todos') params.set('status', filters.status)
    if (filters.roleIds.length > 0) params.set('role_id', filters.roleIds.join(','))
    if (filters.withTools) params.set('assignment', 'with_tools')
    if (filters.hiredFrom !== '') params.set('hired_from', filters.hiredFrom)
    if (filters.hiredTo !== '') params.set('hired_to', filters.hiredTo)
  }

  private static statusFrom(value: QueryParamValue): EmployeeStatusFilter {
    return EMPLOYEE_STATUS_FILTER_VALUES.find((status) => status === value) ?? 'todos'
  }

  private static listFrom(value: QueryParamValue): string[] {
    if (typeof value !== 'string') return []
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item !== '')
  }

  private static flagFrom(value: QueryParamValue): boolean {
    return value === true || value === 1
  }

  private static dateFrom(value: QueryParamValue): string {
    return typeof value === 'string' && ISO_DATE_PATTERN.test(value) ? value : ''
  }
}
