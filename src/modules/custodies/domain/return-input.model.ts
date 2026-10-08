import type { ItemCondition } from '../../shared/domain/item-condition.model'

export interface CreateReturnItemInput {
  stockId: string
  condition: ItemCondition
  notes: string | null
}

export interface CreateReturnInput {
  notes: string | null
  items: CreateReturnItemInput[]
}
