import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import { handleApiError } from '../../../shared/infraestructure/errors/handle-api-error'
import { API_BASE_URL } from '../../../shared/infraestructure/config/api.config'
import type { InventoryRepository as InventoryRepositoryContract } from '../../domain/inventory-repository'
import type { InventoryStats } from '../../domain/inventory-stats.entity'
import type { CatalogTree } from '../../domain/catalog-option.model'
import type { InventoryStatsDto } from '../dto/inventory-stats.dto'
import type { CatalogTreeDto } from '../dto/catalog-tree.dto'
import { InventoryMapper } from '../mappers/inventory.mapper'

class InventoryRepositoryImpl implements InventoryRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = new HttpDataSource(API_BASE_URL)
  }

  async getStats(): Promise<InventoryStats> {
    try {
      const response = await this.datasource.get<InventoryStatsDto>('/products/stats')
      return InventoryMapper.toInventoryStats(response)
    } catch (error) {
      handleApiError(error)
    }
  }

  async getCatalogTree(): Promise<CatalogTree> {
    try {
      const response = await this.datasource.get<CatalogTreeDto>('/brands/catalog/tree')
      return InventoryMapper.toCatalogTree(response)
    } catch (error) {
      handleApiError(error)
    }
  }
}

export const inventoryRepository = new InventoryRepositoryImpl()
