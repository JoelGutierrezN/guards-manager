import type { Tool } from '../domain/tool.entity'

const FULL_PERCENT = 100

export class ToolMetricsHelper {
  static usagePercent(tool: Tool): number {
    if (tool.total === 0) return 0
    return Math.min(FULL_PERCENT, Math.round((tool.assigned / tool.total) * FULL_PERCENT))
  }

  static unusablePercent(tool: Tool): number {
    if (tool.total === 0) return 0
    return Math.min(FULL_PERCENT, Math.round((tool.unusable / tool.total) * FULL_PERCENT))
  }
}
