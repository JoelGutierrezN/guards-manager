import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { InventoryRepository as InventoryRepositoryContract } from '../../domain/inventory-repository'
import type { InventoryStats } from '../../domain/inventory-stats.entity'
import type { CatalogTree } from '../../domain/catalog-option.model'
import type { InventoryStatsDto } from '../dto/inventory-stats.dto'
import type { CatalogTreeDto } from '../dto/catalog-tree.dto'
import { InventoryMapper } from '../mappers/inventory.mapper'

class InventoryRepositoryImpl implements InventoryRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async getStats(): Promise<InventoryStats> {
    const response = await this.datasource.get<InventoryStatsDto>('/products/stats')
    return InventoryMapper.toInventoryStats(response)
  }

  async getCatalogTree(): Promise<CatalogTree> {
    const response = await this.datasource.get<CatalogTreeDto>('/brands/catalog/tree')
    return InventoryMapper.toCatalogTree(response)
  }
}

export const inventoryRepository = new InventoryRepositoryImpl()
