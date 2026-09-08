import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type {
  AssignmentProductOption,
  AssignmentStockProduct,
  AvailableStock,
  AvailableStocksPage,
} from '../../domain/new-assignment-option.model'
import type {
  AssignmentProductCollectionDto,
  AssignmentProductDto,
  AvailableStockCollectionDto,
  AvailableStockDto,
} from '../dto/new-assignment.dto'

const UNKNOWN_PRODUCT_NAME = 'Producto sin nombre'

export class NewAssignmentMapper {
  static toProductOption(dto: AssignmentProductDto): AssignmentProductOption {
    return {
      id: dto.id,
      name: dto.name,
      brandName: dto.brand ?? null,
      modelName: dto.model ?? null,
      available: dto.available ?? null,
    }
  }

  static toProductOptions(dto: AssignmentProductCollectionDto): AssignmentProductOption[] {
    return dto.data.map((product) => NewAssignmentMapper.toProductOption(product))
  }

  static toStockProduct(
    stockId: string,
    dto: AssignmentProductDto | null | undefined,
  ): AssignmentStockProduct {
    return {
      id: dto?.id ?? stockId,
      name: dto?.name ?? UNKNOWN_PRODUCT_NAME,
      brandName: dto?.brand ?? null,
      modelName: dto?.model ?? null,
    }
  }

  static toAvailableStock(dto: AvailableStockDto): AvailableStock {
    return {
      id: dto.id,
      consecutive: dto.consecutive,
      condition: dto.condition,
      product: NewAssignmentMapper.toStockProduct(dto.id, dto.product),
    }
  }

  static toAvailableStocksPage(dto: AvailableStockCollectionDto): AvailableStocksPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      stocks: dto.data.map((stock) => NewAssignmentMapper.toAvailableStock(stock)),
    }
  }
}
