import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { InventoryRepository as InventoryRepositoryContract } from '../../domain/inventory-repository'
import type { ProductOption } from '../../domain/product-option.model'
import type { StockInInput } from '../../domain/stock-in-input.model'
import type { StockInResult } from '../../domain/stock-in-result.model'
import type {
  InventoryProductCollectionDto,
  InventoryProductDto,
} from '../dto/inventory-product.dto'
import type { StockBulkResponseDto } from '../dto/stock-bulk.dto'
import { ProductOptionMapper } from '../mappers/product-option.mapper'
import { StockInResultMapper } from '../mappers/stock-in-result.mapper'

const SEARCH_PAGE_SIZE = '10'

class InventoryRepositoryImpl implements InventoryRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async searchProducts(name: string): Promise<ProductOption[]> {
    const params = new URLSearchParams({ per_page: SEARCH_PAGE_SIZE })
    const trimmedName = name.trim()
    if (trimmedName !== '') params.set('name', trimmedName)

    const response = await this.datasource.get<InventoryProductCollectionDto>(
      `/products?${params.toString()}`,
    )
    return ProductOptionMapper.toProductOptions(response)
  }

  async getProduct(productId: string): Promise<ProductOption> {
    const response = await this.datasource.get<InventoryProductDto>(`/products/${productId}`)
    return ProductOptionMapper.toProductOption(response)
  }

  async createStocks({ productId, quantity, condition }: StockInInput): Promise<StockInResult> {
    const response = await this.datasource.post<StockBulkResponseDto>(
      `/products/${productId}/stocks`,
      { quantity, condition },
    )
    return StockInResultMapper.toStockInResult(response)
  }
}

export const inventoryRepository = new InventoryRepositoryImpl()
