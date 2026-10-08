import type { ItemCondition } from '../../shared/domain/item-condition.model'

export interface StockInInput {
  productId: string
  quantity: number
  condition: ItemCondition
}
