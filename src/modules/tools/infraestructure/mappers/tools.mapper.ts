import type { ToolsStats } from '../../domain/tools-stats.entity'
import type { CatalogTree } from '../../domain/catalog-option.model'
import type { ToolsStatsDto } from '../dto/tools-stats.dto'
import type { CatalogTreeDto } from '../dto/catalog-tree.dto'

export class ToolsMapper {
  static toToolsStats(dto: ToolsStatsDto): ToolsStats {
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
