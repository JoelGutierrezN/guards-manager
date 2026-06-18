import type { Tool } from '../domain/tool.entity'
import type { ToolFilters } from '../domain/tool-filters.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'
import { DEFAULT_STOCK_RANGE } from './tools-state.model'

export class ToolFilterService {
  // TODO API: este filtrado se resolverá server-side con GET /api/tools y query params
  // (brand[], model[], stockMin, stockMax, tab). En mock se aplica localmente.
  static apply(rows: Tool[], filters: ToolFilters, tab: ToolsTabKey): Tool[] {
    let result = rows

    if (filters.brands.length > 0 || filters.models.length > 0) {
      result = result.filter(
        (tool) => filters.brands.includes(tool.brand) || filters.models.includes(tool.model),
      )
    }

    const [minStock, maxStock] = filters.stockRange
    const rangeActive = minStock > DEFAULT_STOCK_RANGE[0] || maxStock < DEFAULT_STOCK_RANGE[1]
    if (rangeActive) {
      result = result.filter((tool) => tool.total >= minStock && tool.total <= maxStock)
    }

    if (tab === 'available') {
      result = result.filter((tool) => tool.status === 'ok')
    } else if (tab === 'assigned') {
      result = result.filter((tool) => tool.assigned > 0)
    } else if (tab === 'low') {
      result = result.filter((tool) => tool.status === 'low' || tool.status === 'warn')
    }

    return result
  }
}
