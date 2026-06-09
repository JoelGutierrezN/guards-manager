import type { Tool } from '../domain/tool.entity'
import type { ToolFilters } from '../domain/tool-filters.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'

export class ToolFilterService {
  static apply(rows: Tool[], filters: ToolFilters, tab: ToolsTabKey): Tool[] {
    let result = rows

    if (filters.brands.length > 0) {
      result = result.filter((tool) => filters.brands.includes(tool.brand))
    }

    if (filters.statuses.length > 0) {
      result = result.filter((tool) => filters.statuses.includes(tool.status))
    }

    if (tab === 'available') {
      result = result.filter((tool) => tool.status === 'ok')
    } else if (tab === 'low') {
      result = result.filter((tool) => tool.status === 'low' || tool.status === 'warn')
    }

    return result
  }
}
