import type { ItemCondition } from '../../shared/domain/item-condition.model'

export interface CreateCustodyItemInput {
  stockId: string
  serial?: string
  condition: ItemCondition
  notes: string | null
}

export interface CreateCustodyInput {
  employeeId: string
  notes: string | null
  items: CreateCustodyItemInput[]
}
