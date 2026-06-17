import type { InventoryStats } from './inventory-stats.entity'
import type { CatalogTree } from './catalog-option.model'

export interface InventoryRepository {
  getStats(): Promise<InventoryStats>
  getCatalogTree(): Promise<CatalogTree>
}
