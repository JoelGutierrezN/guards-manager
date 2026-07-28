import type { QueryParams } from '../../../shared/hooks/query-params.model'
import type { ModelsState } from '../../application/models-state.model'
import { INITIAL_MODELS_STATE } from '../../application/models-state.model'
import type { ModelsFilters, ModelStateFilter } from '../../domain/models-filters.model'

const STATE_FILTER_VALUES: ModelStateFilter[] = ['todos', 'activo', 'baja']

export class ModelsQueryParamsHelper {
  static initialStateFrom(params: QueryParams): ModelsState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const query = typeof params.name === 'string' ? params.name : ''
    const brandId = typeof params.brand === 'string' && params.brand !== '' ? params.brand : null
    const filters: ModelsFilters = {
      state: STATE_FILTER_VALUES.find((value) => value === params.state) ?? 'todos',
      withExistences: params['with-existences'] === true,
      assigned: params.asignated === true,
    }
    return { ...INITIAL_MODELS_STATE, page, query, brandId, filters }
  }

  static toParams(state: Pick<ModelsState, 'page' | 'query' | 'filters'>): QueryParams {
    const { page, query, filters } = state
    return {
      page: page > 1 ? page : undefined,
      name: query !== '' ? query : undefined,
      state: filters.state !== 'todos' ? filters.state : undefined,
      'with-existences': filters.withExistences ? true : undefined,
      asignated: filters.assigned ? true : undefined,
    }
  }

  static toApiParams(
    state: Pick<ModelsState, 'page' | 'query' | 'brandId' | 'filters'>,
  ): URLSearchParams {
    const { page, query, brandId, filters } = state
    const params = new URLSearchParams({ page: String(page) })
    if (brandId) {
      params.set('brand_id', brandId)
    }
    if (query.trim() !== '') {
      params.set('name', query.trim())
    }
    if (filters.state !== 'todos') {
      params.set('state', filters.state)
    }
    if (filters.withExistences) {
      params.set('with-existences', '1')
    }
    if (filters.assigned) {
      params.set('asignated', '1')
    }
    return params
  }
}
