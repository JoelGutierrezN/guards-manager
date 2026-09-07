import {
  DEFAULT_ITEM_CONDITION,
  type ItemCondition,
} from '../../shared/domain/item-condition.model'
import type { ProductOption } from '../domain/product-option.model'
import type { StockInErrorReport } from '../domain/stock-in-error.model'
import type { StockInResult } from '../domain/stock-in-result.model'

export type StockInStatus = 'editing' | 'submitting' | 'done'

export interface StockInState {
  status: StockInStatus
  product: ProductOption | null
  isProductLoading: boolean
  quantity: number
  condition: ItemCondition
  error: StockInErrorReport | null
  result: StockInResult | null
}

export type StockInAction =
  | { type: 'PRODUCT_LOAD_START' }
  | { type: 'PRODUCT_LOAD_SUCCESS'; payload: ProductOption }
  | { type: 'PRODUCT_LOAD_ERROR'; payload: StockInErrorReport }
  | { type: 'PRODUCT_SELECTED'; payload: ProductOption | null }
  | { type: 'QUANTITY_CHANGED'; payload: number }
  | { type: 'CONDITION_CHANGED'; payload: ItemCondition }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; payload: StockInResult }
  | { type: 'SUBMIT_ERROR'; payload: StockInErrorReport }
  | { type: 'ANOTHER_ENTRY_STARTED' }

export const MIN_STOCK_IN_QUANTITY = 1
export const MAX_STOCK_IN_QUANTITY = 500

export const INITIAL_STOCK_IN_STATE: StockInState = {
  status: 'editing',
  product: null,
  isProductLoading: false,
  quantity: MIN_STOCK_IN_QUANTITY,
  condition: DEFAULT_ITEM_CONDITION,
  error: null,
  result: null,
}
