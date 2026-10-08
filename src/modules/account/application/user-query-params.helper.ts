import type { QueryParams } from '../../shared/hooks/query-params.model'
import { INITIAL_USERS_STATE, type UsersState } from './users-state.model'

export interface UsersListRequest {
  page: number
  query: string
}

export class UserQueryParamsHelper {
  static initialStateFrom(params: QueryParams): UsersState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const query = params.q === undefined || params.q === null ? '' : String(params.q)
    return { ...INITIAL_USERS_STATE, page, query }
  }

  static toParams(state: Pick<UsersState, 'page' | 'query'>): QueryParams {
    const { page, query } = state
    return {
      page: page > 1 ? page : undefined,
      q: query !== '' ? query : undefined,
    }
  }

  static toApiParams(request: UsersListRequest): URLSearchParams {
    const params = new URLSearchParams({ page: String(request.page) })
    const query = request.query.trim()
    if (query !== '') params.set('q', query)
    return params
  }
}
