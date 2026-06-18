import type { InventoryStats } from '../../domain/inventory-stats.entity'
import type { CatalogTree } from '../../domain/catalog-option.model'
import type { InventoryStatsDto } from '../dto/inventory-stats.dto'
import type { CatalogTreeDto } from '../dto/catalog-tree.dto'

export class InventoryMapper {
  static toInventoryStats(dto: InventoryStatsDto): InventoryStats {
    return {
      total: dto.total,
      assigned: dto.assigned,
      available: dto.available,
      criticalStock: dto.criticalStock,
    }
  }

  static toCatalogTree(dto: CatalogTreeDto): CatalogTree {
    return {
      maxStock: dto.meta.maxStock,
      brands: dto.data.map((brandDto) => ({
        id: brandDto.id,
        brand: brandDto.name,
        count: brandDto.totalProducts,
        models: brandDto.productModels.map((modelDto) => ({
          id: modelDto.id,
          name: modelDto.name,
          count: modelDto.totalProducts,
        })),
      })),
    }
  }
}
