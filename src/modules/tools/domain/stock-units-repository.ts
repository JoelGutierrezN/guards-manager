import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { ToolUnit, StockUnitStatus } from './tool-unit.model'
import type { StockUnitsListPage } from './stock-units-list-page.model'

export interface StockUnitsListParams {
  productId: string
  status: StockUnitStatus
  query: string
  page: number
  perPage: number
}

export interface StockUnitsRepository {
  list(params: StockUnitsListParams): Promise<StockUnitsListPage>
  updateCondition(stockId: string, condition: ItemCondition): Promise<ToolUnit>
  remove(stockId: string): Promise<void>
}
