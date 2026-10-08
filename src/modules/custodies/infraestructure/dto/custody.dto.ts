import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'
import type { ItemCondition } from '../../../shared/domain/item-condition.model'
import type { CustodyReturnType } from '../../domain/custody-return-type.model'
import type { CustodyStatus } from '../../domain/custody-status.model'

export interface CustodyEmployeeDto {
  id: string
  identifier: string
  name: string
  roleName: string | null
}

export interface CustodyAuthorDto {
  id: string
  name: string
}

export interface CustodySheetDto {
  id: string
  code: string
  filename: string
  sizeBytes: number
  url: string
}

export interface CustodySignatureDto {
  signedAt: string
  signerName: string
}

export interface CustodyItemProductDto {
  id: string
  name: string
  brand: string | null
  model: string | null
}

export interface CustodyItemStockDto {
  id: string
  consecutive: string
  condition: ItemCondition
  /** Se emite cuando el producto fue dado de baja y `product` llega en `null`. */
  productId?: string
  product: CustodyItemProductDto | null
}

export interface CustodyItemDto {
  id: string
  condition: ItemCondition
  notes: string | null
  isReturned: boolean
  returnedAt: string | null
  /** Red de seguridad del API: viaja siempre, incluso si la unidad fue dada de baja. */
  stockId: string
  stock: CustodyItemStockDto | null
}

export interface CustodyReturnSummaryDto {
  id: string
  code: string
  custodyId: string
  custodyCode: string
  type: CustodyReturnType
  notes: string | null
  receivedBy: CustodyAuthorDto | null
  itemsCount: number
  signedAt: string | null
  sheet: CustodySheetDto | null
  createdAt: string
}

export interface CustodyDto {
  id: string
  code: string
  status: CustodyStatus
  notes: string | null
  employee: CustodyEmployeeDto
  createdBy: CustodyAuthorDto | null
  itemsCount: number
  pendingItemsCount: number
  signedAt: string | null
  sheet: CustodySheetDto | null
  createdAt: string
  updatedAt: string
}

export interface CustodyDetailDto extends CustodyDto {
  items: CustodyItemDto[]
  returns: CustodyReturnSummaryDto[]
  signature: CustodySignatureDto | null
}

export interface CustodiesStatsDto {
  total: number
  active: number
  partial: number
  returned: number
  cancelled: number
  pendingSignature: number
}

export interface CustodyCollectionDto {
  data: CustodyDto[]
  meta: PaginationMetaDto
  stats: CustodiesStatsDto
}

export interface CustodyItemRequestDto {
  stock_id: string
  condition: ItemCondition
  notes?: string
}

export interface CustodyRequestDto {
  employee_id: string
  notes?: string
  items: CustodyItemRequestDto[]
}
