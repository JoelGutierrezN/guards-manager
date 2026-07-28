import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { ProductModel } from '../../domain/product-model.entity'
import type { ProductModelPage } from '../../domain/product-model-page.model'
import type { ProductModelDto } from '../dto/product-model.dto'
import type { ProductModelCollectionDto } from '../dto/product-model-collection.dto'

export class ProductModelMapper {
  static toProductModel(dto: ProductModelDto): ProductModel {
    const { id, name, brand, stocksTotal, stocksAssigned, usagePercentage, active } = dto

    return {
      id,
      name,
      brandId: brand.id,
      brandName: brand.name,
      stocksTotal: stocksTotal ?? 0,
      stocksAssigned: stocksAssigned ?? 0,
      usagePercentage: usagePercentage ?? 0,
      active: active ?? true,
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
