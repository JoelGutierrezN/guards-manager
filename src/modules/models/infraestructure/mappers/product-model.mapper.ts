import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { ProductModel } from '../../domain/product-model.entity'
import type { ProductModelPage } from '../../domain/product-model-page.model'
import type {
  NameCheckMatch,
  ProductModelNameCheck,
} from '../../domain/product-model-name-check.model'
import type { ProductModelDto } from '../dto/product-model.dto'
import type { ProductModelCollectionDto } from '../dto/product-model-collection.dto'
import type {
  NameCheckModelDto,
  ProductModelNameCheckDto,
} from '../dto/product-model-name-check.dto'

export class ProductModelMapper {
  static toProductModel(dto: ProductModelDto): ProductModel {
    const {
      id,
      name,
      brand,
      stocksTotal,
      stocksAssigned,
      usagePercentage,
      status,
      discontinuationReason,
    } = dto

    return {
      id,
      name,
      brandId: brand.id,
      brandName: brand.name,
      stocksTotal: stocksTotal ?? 0,
      stocksAssigned: stocksAssigned ?? 0,
      usagePercentage: usagePercentage ?? 0,
      active: (status ?? 'activo') !== 'baja',
      discontinuationReason: discontinuationReason ?? null,
    }
  }

  static toNameCheckMatch(dto: NameCheckModelDto): NameCheckMatch {
    return {
      id: dto.id,
      name: dto.name,
      active: dto.status !== 'discontinued',
    }
  }

  static toNameCheck(dto: ProductModelNameCheckDto): ProductModelNameCheck {
    return {
      exists: dto.exists,
      exactMatch:
        dto.productModel != null ? ProductModelMapper.toNameCheckMatch(dto.productModel) : null,
      similar: dto.similar.map((model) => ProductModelMapper.toNameCheckMatch(model)),
    }
  }

  static toProductModelPage(dto: ProductModelCollectionDto): ProductModelPage {
    const { data, meta } = dto
    const { productModels, brands, stocks } = meta

    return {
      ...PaginationMapper.toPagination(meta),
      models: data.map((model) => ProductModelMapper.toProductModel(model)),
      modelsTotal: productModels ?? 0,
      brandsTotal: brands ?? 0,
      stocksTotal: stocks ?? 0,
    }
  }
}
