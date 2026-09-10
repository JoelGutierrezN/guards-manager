import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { CustodyAuthor, CustodyItemProduct, CustodySheet } from './custody.entity'
import type { CustodyReturnType } from './custody-return-type.model'

export interface ReturnEmployee {
  id: string
  identifier: string
  name: string
}

export interface ReturnItemStock {
  id: string
  consecutive: string
  condition: ItemCondition
  product: CustodyItemProduct
}

export interface ReturnItem {
  id: string
  condition: ItemCondition
  conditionNotes: string | null
  stock: ReturnItemStock
}

export interface CustodyReturn {
  id: string
  code: string
  custodyId: string
  custodyCode: string
  employeeId: string | null
  employee: ReturnEmployee | null
  type: CustodyReturnType
  notes: string | null
  receivedBy: CustodyAuthor | null
  itemsCount: number
  items: ReturnItem[]
  signedAt: string | null
  sheet: CustodySheet | null
  createdAt: string
}
