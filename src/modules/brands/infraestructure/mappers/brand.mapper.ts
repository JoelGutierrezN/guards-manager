import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { Brand } from '../../domain/brand.entity'
import type { BrandPage } from '../../domain/brand-page.model'
import type { BrandSelectOption } from '../../domain/brand-select.model'
import type { BrandDto } from '../dto/brand.dto'
import type { BrandCollectionDto } from '../dto/brand-collection.dto'
import type { BrandSelectDto } from '../dto/brand-select.dto'

export class BrandMapper {
  static toBrand(dto: BrandDto): Brand {
    return {
      id: dto.id,
      name: dto.name,
      modelsCount: dto.productModelsCount ?? 0,
      toolsTotal: dto.stocksTotal ?? 0,
      toolsAssigned: dto.stocksAssigned ?? 0,
    }
  }

  static toBrandSelectOption(dto: BrandSelectDto): BrandSelectOption {
    return {
      id: String(dto.id),
      name: dto.name,
      modelsCount: dto.modelsCount ?? 0,
    }
  }

  static toBrandPage(dto: BrandCollectionDto): BrandPage {
    const { data, meta } = dto
    const { productModels, products } = meta

    return {
      ...PaginationMapper.toPagination(meta),
      brands: data.map((brand) => BrandMapper.toBrand(brand)),
      modelsTotal: productModels ?? 0,
      toolsTotal: products ?? 0,
    }
  }
}
