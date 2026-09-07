import type { StockUnitsTabState } from '../../application/stock-units-state.model'
import type { StockUnitStatus } from '../../domain/tool-unit.model'
import type { Tool } from '../../domain/tool.entity'

export class StockUnitsTabCountHelper {
  static countFor(
    tool: Tool | null,
    status: StockUnitStatus,
    tabState: StockUnitsTabState,
  ): number | undefined {
    if (tabState.status !== 'idle') return tabState.total
    if (tool === null) return undefined
    return StockUnitsTabCountHelper.productCountFor(tool, status)
  }

  private static productCountFor(tool: Tool, status: StockUnitStatus): number {
    if (status === 'available') return tool.available
    if (status === 'assigned') return tool.assigned
    return tool.unusable
  }
}
