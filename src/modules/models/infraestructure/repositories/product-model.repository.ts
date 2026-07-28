import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { ProductModelRepository as ProductModelRepositoryContract } from '../../domain/product-model-repository'
import type { ProductModel } from '../../domain/product-model.entity'
import type { ProductModelPage } from '../../domain/product-model-page.model'
import type { CreateProductModelInput, UpdateProductModelInput } from '../../domain/product-model-input.model'
import type { ProductModelCollectionDto } from '../dto/product-model-collection.dto'
import type { ProductModelItemDto } from '../dto/product-model-item.dto'
import { ProductModelMapper } from '../mappers/product-model.mapper'

class ProductModelRepositoryImpl implements ProductModelRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async list(params: URLSearchParams): Promise<ProductModelPage> {
    const response = await this.datasource.get<ProductModelCollectionDto>(
      `/product-models?${params.toString()}`,
    )
    return ProductModelMapper.toProductModelPage(response)
  }

  async create(input: CreateProductModelInput): Promise<ProductModel> {
    const { name, brandId } = input
    const response = await this.datasource.post<ProductModelItemDto>('/product-models', {
      name,
      brand_id: brandId,
    })
    const { data } = response
    return ProductModelMapper.toProductModel(data)
  }

  async update(id: string, input: UpdateProductModelInput): Promise<ProductModel> {
    const { name, brandId } = input
    const response = await this.datasource.put<ProductModelItemDto>(`/product-models/${id}`, {
      name,
      brand_id: brandId,
    })
    const { data } = response
    return ProductModelMapper.toProductModel(data)
  }

  async setActive(id: string, active: boolean): Promise<ProductModel> {
    const response = await this.datasource.patch<ProductModelItemDto>(
      `/product-models/${id}/status`,
      { active },
    )
    const { data } = response
    return ProductModelMapper.toProductModel(data)
  }

  async remove(id: string): Promise<void> {
    await this.datasource.delete(`/product-models/${id}`)
  }
}

export const productModelRepository = new ProductModelRepositoryImpl()
