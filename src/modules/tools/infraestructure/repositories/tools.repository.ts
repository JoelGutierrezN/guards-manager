import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { ToolsRepository as ToolsRepositoryContract } from '../../domain/tools-repository'
import type { ToolsStats } from '../../domain/tools-stats.entity'
import type { CatalogTree } from '../../domain/catalog-option.model'
import type { Tool } from '../../domain/tool.entity'
import type { ToolInput } from '../../domain/tool-input.model'
import type { ToolsPage } from '../../domain/tools-page.model'
import type { ToolsStatsDto } from '../dto/tools-stats.dto'
import type { CatalogTreeDto } from '../dto/catalog-tree.dto'
import type { ProductCollectionDto, ProductDto } from '../dto/product.dto'
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

  async create(input: ToolInput): Promise<Tool> {
    const response = await this.datasource.post<ProductDto>(
      '/products',
      ProductMapper.toRequestBody(input),
    )
    return ProductMapper.toTool(response)
  }

  async update(id: string, input: ToolInput): Promise<Tool> {
    const response = await this.datasource.put<ProductDto>(
      `/products/${id}`,
      ProductMapper.toRequestBody(input),
    )
    return ProductMapper.toTool(response)
  }

  async remove(id: string): Promise<void> {
    await this.datasource.delete(`/products/${id}`)
  }
}

export const toolsRepository = new ToolsRepositoryImpl()
