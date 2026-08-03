import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { ToolsRepository as ToolsRepositoryContract } from '../../domain/tools-repository'
import type { ToolsStats } from '../../domain/tools-stats.entity'
import type { CatalogTree } from '../../domain/catalog-option.model'
import type { ToolsPage } from '../../domain/tools-page.model'
import type { ToolsStatsDto } from '../dto/tools-stats.dto'
import type { CatalogTreeDto } from '../dto/catalog-tree.dto'
import type { ProductCollectionDto } from '../dto/product.dto'
import { ToolsMapper } from '../mappers/tools.mapper'
import { ProductMapper } from '../mappers/product.mapper'

class ToolsRepositoryImpl implements ToolsRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async getStats(): Promise<ToolsStats> {
    const response = await this.datasource.get<ToolsStatsDto>('/products/stats')
    return ToolsMapper.toToolsStats(response)
  }

  async getCatalogTree(): Promise<CatalogTree> {
    const response = await this.datasource.get<CatalogTreeDto>('/brands/catalog/tree')
    return ToolsMapper.toCatalogTree(response)
  }

  async listProducts(params: URLSearchParams): Promise<ToolsPage> {
    const response = await this.datasource.get<ProductCollectionDto>(
      `/products?${params.toString()}`,
    )
    return ProductMapper.toToolsPage(response)
  }
}

export const toolsRepository = new ToolsRepositoryImpl()
