import type { Brand } from '../../domain/brand.entity'
import type { BrandPage } from '../../domain/brand-page.model'
import type { BrandDto } from '../dto/brand.dto'
import type { BrandCollectionDto } from '../dto/brand-collection.dto'

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

  static toBrandPage(dto: BrandCollectionDto): BrandPage {
    return {
      brands: dto.data.map((brand) => BrandMapper.toBrand(brand)),
      page: dto.meta.current_page,
      perPage: dto.meta.per_page,
      lastPage: dto.meta.last_page,
      total: dto.meta.total,
      modelsTotal: dto.meta.productModels ?? 0,
      toolsTotal: dto.meta.products ?? 0,
    }
  }
}
