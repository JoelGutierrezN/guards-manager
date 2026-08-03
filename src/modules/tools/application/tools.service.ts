import type { Tool } from '../domain/tool.entity'

export class ToolsService {
  // TODO API: persistir el ingreso con POST /api/tools/{toolId}/stock-in; aquí solo se actualiza en memoria.
  static addStock(rows: Tool[], toolId: string, quantity: number): Tool[] {
    return rows.map((tool) =>
      tool.id === toolId ? { ...tool, total: tool.total + quantity } : tool,
    )
  }

  static availableCount(tool: Tool): number {
    return tool.total - tool.assigned
  }

  static usagePercent(tool: Tool): number {
    if (tool.total === 0) return 0
    return Math.min(100, Math.round((tool.assigned / tool.total) * 100))
  }
}
