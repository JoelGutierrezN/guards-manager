import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { Tool, ToolStatus } from '../../domain/tool.entity'
import type { ToolsPage } from '../../domain/tools-page.model'
import type { ProductDto, ProductCollectionDto } from '../dto/product.dto'

export class ProductMapper {
  static toToolStatus(dto: ProductDto): ToolStatus {
    if (dto.available === 0) return 'low'
    if (dto.warns > 0) return 'warn'
    return 'ok'
  }

  static toTool(dto: ProductDto): Tool {
    return {
      id: dto.id,
      name: dto.name,
      brand: dto.brand ?? '—',
      model: dto.model ?? '—',
      total: dto.total,
      // El listado no expone asignadas; se aproxima con total - disponibles (incluye dañadas).
      assigned: dto.total - dto.available,
      status: ProductMapper.toToolStatus(dto),
    }
  }

  static toToolsPage(dto: ProductCollectionDto): ToolsPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      tools: dto.data.map((product) => ProductMapper.toTool(product)),
    }
  }
}
