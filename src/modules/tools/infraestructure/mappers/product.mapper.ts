import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { Tool, ToolStatus } from '../../domain/tool.entity'
import type { ToolInput } from '../../domain/tool-input.model'
import type { ToolsPage } from '../../domain/tools-page.model'
import type { ProductDto, ProductCollectionDto } from '../dto/product.dto'

const UNKNOWN_LABEL = '—'

export class ProductMapper {
  static toToolStatus(available: number, warns: number): ToolStatus {
    if (available === 0) return 'low'
    if (warns > 0) return 'warn'
    return 'ok'
  }

  static toTool(dto: ProductDto): Tool {
    const available = dto.available ?? 0
    return {
      id: dto.id,
      name: dto.name,
      brand: dto.brand ?? UNKNOWN_LABEL,
      brandId: dto.brandId ?? null,
      model: dto.model ?? UNKNOWN_LABEL,
      productModelId: dto.productModelId ?? null,
      total: dto.total ?? 0,
      available,
      assigned: dto.assigned ?? 0,
      unusable: dto.unusable ?? 0,
      status: ProductMapper.toToolStatus(available, dto.warns ?? 0),
    }
  }

  static toToolsPage(dto: ProductCollectionDto): ToolsPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      tools: dto.data.map((product) => ProductMapper.toTool(product)),
    }
  }

  static toRequestBody(input: ToolInput): Record<string, string> {
    return {
      name: input.name,
      brand_id: input.brandId,
      product_model_id: input.productModelId,
    }
  }
}
