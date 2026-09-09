import type { ItemCondition } from '../../../shared/domain/item-condition.model'
import type { CustodyReturnType } from '../../domain/custody-return-type.model'
import type { CustodyAuthorDto, CustodyItemProductDto, CustodySheetDto } from './custody.dto'

export interface ReturnEmployeeDto {
  id: string
  identifier: string
  name: string
}

export interface ReturnItemStockDto {
  id: string
  consecutive: string
  condition: ItemCondition
  /** Se emite cuando el producto fue dado de baja y `product` llega en `null`. */
  productId?: string
  product: CustodyItemProductDto | null
}

export interface ReturnItemDto {
  id: string
  condition: ItemCondition
  conditionNotes: string | null
  /** Red de seguridad del API: viaja siempre, incluso si la unidad fue dada de baja. */
  stockId: string
  stock: ReturnItemStockDto | null
}

export interface ReturnDto {
  id: string
  code: string
  custodyId: string
  custodyCode: string | null
  /** Se emite siempre, aunque `employee` no resuelva (empleado dado de baja). */
  employeeId: string | null
  employee: ReturnEmployeeDto | null
  type: CustodyReturnType
  notes: string | null
  receivedBy: CustodyAuthorDto | null
  itemsCount: number
  items?: ReturnItemDto[]
  signedAt: string | null
  sheet: CustodySheetDto | null
  createdAt: string
}

export interface ReturnItemRequestDto {
  stock_id: string
  condition: ItemCondition
  notes?: string
}

export interface ReturnRequestDto {
  notes?: string
  items: ReturnItemRequestDto[]
}
