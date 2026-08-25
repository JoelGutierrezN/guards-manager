import type { QueryParams } from '../../../shared/hooks/query-params.model'
import {
  INITIAL_EMPLOYEES_STATE,
  type EmployeesState,
} from '../../application/employees-state.model'

export interface EmployeesListRequest {
  page: number
  query: string
}

const IDENTIFIER_PATTERN = /^ett-?\d*$/i

export class EmployeeQueryParamsHelper {
  static initialStateFrom(params: QueryParams): EmployeesState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const query = params.q === undefined || params.q === null ? '' : String(params.q)
    return { ...INITIAL_EMPLOYEES_STATE, page, query }
  }

  static toParams(state: Pick<EmployeesState, 'page' | 'query'>): QueryParams {
    return {
      page: state.page > 1 ? state.page : undefined,
      q: state.query !== '' ? state.query : undefined,
    }
  }

  static toApiParams(request: EmployeesListRequest): URLSearchParams {
    const params = new URLSearchParams({ page: String(request.page) })
    const query = request.query.trim()
    if (query === '') return params

    const searchKey = IDENTIFIER_PATTERN.test(query) ? 'identifier' : 'name'
    params.set(searchKey, query)
    return params
  }
}
