import type { QueryParams, QueryParamValue } from '../../../shared/hooks/query-params.model'
import type { ToolFilters } from '../../domain/tool-filters.model'
import type { ToolsSort, ToolsSortDirection } from '../../domain/tools-sort.model'
import { TOOLS_SORT_KEYS } from '../../domain/tools-sort.model'
import type { ToolsTabKey } from '../../domain/tools-tab.model'
import type { ToolsState } from '../../application/tools-state.model'
import {
  DEFAULT_STOCK_RANGE,
  DEFAULT_TOOLS_SORT,
  INITIAL_TOOLS_STATE,
} from '../../application/tools-state.model'

const TAB_VALUES: ToolsTabKey[] = ['all', 'available', 'assigned', 'low']

const TAB_STATUS_PARAM: Partial<Record<ToolsTabKey, string>> = {
  available: 'available',
  assigned: 'assigned',
  low: 'lowStock',
}

export interface ToolsListRequest {
  page: number
  tab: ToolsTabKey
  search: string
  sort: ToolsSort
  filters: ToolFilters
}

export class ToolsQueryParamsHelper {
  private static toStringArray(value: QueryParamValue): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string')
    }
    return typeof value === 'string' && value !== '' ? [value] : []
  }

  private static toSort(sortValue: QueryParamValue, dirValue: QueryParamValue): ToolsSort {
    const key = TOOLS_SORT_KEYS.find((sortKey) => sortKey === sortValue)
    if (key === undefined) return DEFAULT_TOOLS_SORT
    const direction: ToolsSortDirection = dirValue === 'desc' ? 'desc' : 'asc'
    return { key, direction }
  }

  static initialStateFrom(params: QueryParams): ToolsState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const tab = TAB_VALUES.find((tabValue) => tabValue === params.tab) ?? 'all'
    const stockMin = typeof params.stockMin === 'number' ? params.stockMin : DEFAULT_STOCK_RANGE[0]
    const stockMax = typeof params.stockMax === 'number' ? params.stockMax : DEFAULT_STOCK_RANGE[1]
    const search = typeof params.name === 'string' ? params.name : ''
    const filters: ToolFilters = {
      brands: ToolsQueryParamsHelper.toStringArray(params.brands),
      models: ToolsQueryParamsHelper.toStringArray(params.models),
      stockRange: [stockMin, stockMax],
    }
    return {
      ...INITIAL_TOOLS_STATE,
      page,
      tab,
      search,
      sort: ToolsQueryParamsHelper.toSort(params.sort, params.dir),
      filters,
    }
  }

  static toParams(state: Pick<ToolsState, 'page' | 'tab' | 'search' | 'sort' | 'filters'>) {
    const { page, tab, search, sort, filters } = state
    const [stockMin, stockMax] = filters.stockRange
    const isDefaultSort =
      sort.key === DEFAULT_TOOLS_SORT.key && sort.direction === DEFAULT_TOOLS_SORT.direction
    return {
      page: page > 1 ? page : undefined,
      tab: tab !== 'all' ? tab : undefined,
      name: search.trim() !== '' ? search.trim() : undefined,
      sort: isDefaultSort ? undefined : sort.key,
      dir: isDefaultSort ? undefined : sort.direction,
      brands: filters.brands.length > 0 ? filters.brands : undefined,
      models: filters.models.length > 0 ? filters.models : undefined,
      stockMin: stockMin > DEFAULT_STOCK_RANGE[0] ? stockMin : undefined,
      stockMax: stockMax < DEFAULT_STOCK_RANGE[1] ? stockMax : undefined,
    } satisfies QueryParams
  }

  static toApiParams(request: ToolsListRequest): URLSearchParams {
    const { page, tab, search, sort, filters } = request
    const params = new URLSearchParams({ page: String(page) })
    const statusParam = TAB_STATUS_PARAM[tab]
    if (statusParam) {
      params.set('status', statusParam)
    }
    const trimmedSearch = search.trim()
    if (trimmedSearch !== '') {
      params.set('name', trimmedSearch)
    }
    params.set('sort', sort.key)
    params.set('dir', sort.direction)
    filters.brands.forEach((brandId) => params.append('brandIds[]', brandId))
    filters.models.forEach((modelId) => params.append('productModelIds[]', modelId))
    const [stockMin, stockMax] = filters.stockRange
    if (stockMin > DEFAULT_STOCK_RANGE[0]) {
      params.set('stockMin', String(stockMin))
    }
    if (stockMax < DEFAULT_STOCK_RANGE[1]) {
      params.set('stockMax', String(stockMax))
    }
    return params
  }
}
