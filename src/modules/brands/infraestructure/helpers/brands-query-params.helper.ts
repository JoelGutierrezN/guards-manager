import type { QueryParams } from '../../../shared/hooks/query-params.model'
import type { BrandsState } from '../../application/brands-state.model'
import { INITIAL_BRANDS_STATE } from '../../application/brands-state.model'

export class BrandsQueryParamsHelper {
  static initialStateFrom(params: QueryParams): BrandsState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const query = typeof params.name === 'string' ? params.name : ''
    return { ...INITIAL_BRANDS_STATE, page, query }
  }

  static toParams(state: Pick<BrandsState, 'page' | 'query'>): QueryParams {
    return {
      page: state.page > 1 ? state.page : undefined,
      name: state.query !== '' ? state.query : undefined,
    }
  }
}
