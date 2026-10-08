import type { ProductOption } from '../../domain/product-option.model'
import type {
  InventoryProductCollectionDto,
  InventoryProductDto,
} from '../dto/inventory-product.dto'

export class ProductOptionMapper {
  static toProductOption(dto: InventoryProductDto): ProductOption {
    return {
      id: dto.id,
      name: dto.name,
      brandName: dto.brand ?? null,
      modelName: dto.model ?? null,
      total: dto.total ?? null,
      available: dto.available ?? null,
    }
  }

  static toProductOptions(dto: InventoryProductCollectionDto): ProductOption[] {
    return dto.data.map((product) => ProductOptionMapper.toProductOption(product))
  }
}
