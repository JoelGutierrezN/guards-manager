import type { QueryParams, QueryParamValue } from '../../../shared/hooks/query-params.model'
import {
  INITIAL_CUSTODIES_STATE,
  type CustodiesState,
} from '../../application/custodies-state.model'
import type { CustodiesFilters } from '../../domain/custodies-filters.model'
import { CUSTODY_STATUSES, type CustodyStatus } from '../../domain/custody-status.model'

export interface CustodiesListRequest {
  page: number
  query: string
  filters: CustodiesFilters
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export class CustodyQueryParamsHelper {
  static initialStateFrom(params: QueryParams): CustodiesState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const query = params.q === undefined || params.q === null ? '' : String(params.q)
    const filters: CustodiesFilters = {
      statuses: CustodyQueryParamsHelper.statusesFrom(params.status),
      employeeId: CustodyQueryParamsHelper.textFrom(params.employee),
      employeeName: '',
      dateFrom: CustodyQueryParamsHelper.dateFrom(params.from),
      dateTo: CustodyQueryParamsHelper.dateFrom(params.to),
    }
    return { ...INITIAL_CUSTODIES_STATE, page, query, filters }
  }

  static toParams(state: Pick<CustodiesState, 'page' | 'query' | 'filters'>): QueryParams {
    const { page, query, filters } = state
    return {
      page: page > 1 ? page : undefined,
      q: query !== '' ? query : undefined,
      status: filters.statuses.length > 0 ? filters.statuses.join(',') : undefined,
      employee: filters.employeeId !== '' ? filters.employeeId : undefined,
      from: filters.dateFrom !== '' ? filters.dateFrom : undefined,
      to: filters.dateTo !== '' ? filters.dateTo : undefined,
    }
  }

  static toApiParams(request: CustodiesListRequest): URLSearchParams {
    const params = new URLSearchParams({ page: String(request.page) })
    const { filters } = request
    const query = request.query.trim()

    if (query !== '') params.set('q', query)
    filters.statuses.forEach((status) => params.append('status[]', status))
    if (filters.employeeId !== '') params.set('employee_id', filters.employeeId)
    if (filters.dateFrom !== '') params.set('date_from', filters.dateFrom)
    if (filters.dateTo !== '') params.set('date_to', filters.dateTo)

    return params
  }

  private static statusesFrom(value: QueryParamValue): CustodyStatus[] {
    if (typeof value !== 'string') return []
    return value
      .split(',')
      .map((item) => item.trim().toUpperCase())
      .filter((item): item is CustodyStatus => CUSTODY_STATUSES.includes(item as CustodyStatus))
  }

  private static textFrom(value: QueryParamValue): string {
    return typeof value === 'string' ? value.trim() : ''
  }

  private static dateFrom(value: QueryParamValue): string {
    return typeof value === 'string' && ISO_DATE_PATTERN.test(value) ? value : ''
  }
}
