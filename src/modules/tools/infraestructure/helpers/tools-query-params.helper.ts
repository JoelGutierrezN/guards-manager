import type { QueryParams, QueryParamValue } from '../../../shared/hooks/query-params.model'
import type { ToolFilters } from '../../domain/tool-filters.model'
import type { ToolsTabKey } from '../../domain/tools-tab.model'
import type { ToolsState } from '../../application/tools-state.model'
import { DEFAULT_STOCK_RANGE, INITIAL_TOOLS_STATE } from '../../application/tools-state.model'

const TAB_VALUES: ToolsTabKey[] = ['all', 'available', 'assigned', 'low']

const TAB_STATUS_PARAM: Partial<Record<ToolsTabKey, string>> = {
  available: 'available',
  assigned: 'assigned',
  low: 'lowStock',
}

export interface ToolsListRequest {
  page: number
  tab: ToolsTabKey
  filters: ToolFilters
}

export class ToolsQueryParamsHelper {
  private static toStringArray(value: QueryParamValue): string[] {
    if (Array.isArray(value)) {
      return value.filter((item): item is string => typeof item === 'string')
    }
    return typeof value === 'string' && value !== '' ? [value] : []
  }

  static initialStateFrom(params: QueryParams): ToolsState {
    const page = typeof params.page === 'number' && params.page >= 1 ? Math.trunc(params.page) : 1
    const tab = TAB_VALUES.find((tabValue) => tabValue === params.tab) ?? 'all'
    const stockMin = typeof params.stockMin === 'number' ? params.stockMin : DEFAULT_STOCK_RANGE[0]
    const stockMax = typeof params.stockMax === 'number' ? params.stockMax : DEFAULT_STOCK_RANGE[1]
    const filters: ToolFilters = {
      brands: ToolsQueryParamsHelper.toStringArray(params.brands),
      models: ToolsQueryParamsHelper.toStringArray(params.models),
      stockRange: [stockMin, stockMax],
    }
    return { ...INITIAL_TOOLS_STATE, page, tab, filters }
  }

  static toParams(state: Pick<ToolsState, 'page' | 'tab' | 'filters'>): QueryParams {
    const { page, tab, filters } = state
    const [stockMin, stockMax] = filters.stockRange
    return {
      page: page > 1 ? page : undefined,
      tab: tab !== 'all' ? tab : undefined,
      brands: filters.brands.length > 0 ? filters.brands : undefined,
      models: filters.models.length > 0 ? filters.models : undefined,
      stockMin: stockMin > DEFAULT_STOCK_RANGE[0] ? stockMin : undefined,
      stockMax: stockMax < DEFAULT_STOCK_RANGE[1] ? stockMax : undefined,
    }
  }

  static toApiParams(request: ToolsListRequest): URLSearchParams {
    const { page, tab, filters } = request
    const params = new URLSearchParams({ page: String(page) })
    const statusParam = TAB_STATUS_PARAM[tab]
    if (statusParam) {
      params.set('status', statusParam)
    }
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
