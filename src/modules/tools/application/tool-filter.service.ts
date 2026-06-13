import type { Tool } from '../domain/tool.entity'
import type { ToolFilters } from '../domain/tool-filters.model'
import type { ToolsTabKey } from '../domain/tools-tab.model'

export class ToolFilterService {
  // TODO API: este filtrado se resolverá server-side con GET /api/tools y query params
  // (brand[], model[], stockMin, stockMax, q, tab). En mock se aplica localmente.
  static apply(rows: Tool[], filters: ToolFilters, tab: ToolsTabKey, searchQuery: string): Tool[] {
    let result = rows

    if (filters.brands.length > 0) {
      result = result.filter((tool) => filters.brands.includes(tool.brand))
    }

    if (filters.models.length > 0) {
      result = result.filter((tool) => filters.models.includes(tool.model))
    }

    // TODO API: el RANGO DE STOCK (filters.stockRange) se filtra en el servidor
    // (GET /api/tools?stockMin=&stockMax=); el campo y los límites los define la API.

    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (normalizedQuery) {
      result = result.filter(
        (tool) =>
          tool.name.toLowerCase().includes(normalizedQuery) ||
          tool.model.toLowerCase().includes(normalizedQuery),
      )
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
