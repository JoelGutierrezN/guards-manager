import type { QueryParams } from '../../../shared/hooks/query-params.model'
import type { ModelsState } from '../../application/models-state.model'
import { INITIAL_MODELS_STATE } from '../../application/models-state.model'

export class ModelsQueryParamsHelper {
  static initialStateFrom(params: QueryParams): ModelsState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const query = typeof params.name === 'string' ? params.name : ''
    const brandId = typeof params.brand === 'string' && params.brand !== '' ? params.brand : null
    return { ...INITIAL_MODELS_STATE, page, query, brandId }
  }

  static toParams(state: Pick<ModelsState, 'page' | 'query'>): QueryParams {
    return {
      page: state.page > 1 ? state.page : undefined,
      name: state.query !== '' ? state.query : undefined,
    }
  }

  static toApiParams(state: Pick<ModelsState, 'page' | 'query' | 'brandId'>): URLSearchParams {
    const { page, query, brandId } = state
    const params = new URLSearchParams({ page: String(page) })
    if (brandId) {
      params.set('brand_id', brandId)
    }
    if (query.trim() !== '') {
      params.set('name', query.trim())
    }
    return params
  }
}
