import type { ProductOption } from './product-option.model'
import type { StockInInput } from './stock-in-input.model'
import type { StockInResult } from './stock-in-result.model'

export interface InventoryRepository {
  searchProducts(name: string): Promise<ProductOption[]>
  getProduct(productId: string): Promise<ProductOption>
  createStocks(input: StockInInput): Promise<StockInResult>
}
