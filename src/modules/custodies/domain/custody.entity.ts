import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { CustodyReturnType } from './custody-return-type.model'
import type { CustodyStatus } from './custody-status.model'

export interface CustodyEmployee {
  id: string
  identifier: string
  name: string
  roleName: string | null
}

export interface CustodyAuthor {
  id: string
  name: string
}

export interface CustodySheet {
  id: string
  code: string
  filename: string
  sizeBytes: number
  url: string
}

export interface CustodySignature {
  signedAt: string
  signerName: string
}

export interface CustodyItemProduct {
  id: string
  name: string
  brand: string | null
  model: string | null
}

export interface CustodyItemStock {
  id: string
  consecutive: string
  condition: ItemCondition
  product: CustodyItemProduct
}

export interface CustodyItem {
  id: string
  condition: ItemCondition
  notes: string | null
  isReturned: boolean
  returnedAt: string | null
  stock: CustodyItemStock
}

export interface CustodyReturnSummary {
  id: string
  code: string
  custodyId: string
  custodyCode: string
  type: CustodyReturnType
  notes: string | null
  receivedBy: CustodyAuthor | null
  itemsCount: number
  signedAt: string | null
  sheet: CustodySheet | null
  createdAt: string
}

export interface Custody {
  id: string
  code: string
  status: CustodyStatus
  notes: string | null
  employee: CustodyEmployee
  createdBy: CustodyAuthor | null
  itemsCount: number
  pendingItemsCount: number
  signedAt: string | null
  sheet: CustodySheet | null
  createdAt: string
  updatedAt: string
}

export interface CustodyDetail extends Custody {
  items: CustodyItem[]
  returns: CustodyReturnSummary[]
  signature: CustodySignature | null
}
