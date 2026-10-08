import type { Pagination } from '../../shared/domain/pagination.model'
import type { ItemCondition } from '../../shared/domain/item-condition.model'

export interface AssignmentProductOption {
  id: string
  name: string
  brandName: string | null
  modelName: string | null
  available: number | null
}

export interface AssignmentStockProduct {
  id: string
  name: string
  brandName: string | null
  modelName: string | null
}

/** Unidad libre que el wizard puede sumar al resguardo (`GET /stocks?status=available`). */
export interface AvailableStock {
  id: string
  consecutive: string
  condition: ItemCondition
  product: AssignmentStockProduct
}

export interface AvailableStocksPage extends Pagination {
  stocks: AvailableStock[]
}
