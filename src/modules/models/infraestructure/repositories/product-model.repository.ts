import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { ProductModelRepository as ProductModelRepositoryContract } from '../../domain/product-model-repository'
import type { ProductModel } from '../../domain/product-model.entity'
import type { ProductModelPage } from '../../domain/product-model-page.model'
import type {
  CreateProductModelInput,
  UpdateProductModelInput,
} from '../../domain/product-model-input.model'
import type { ProductModelNameCheck } from '../../domain/product-model-name-check.model'
import type { ProductModelCollectionDto } from '../dto/product-model-collection.dto'
import type { ProductModelNameCheckDto } from '../dto/product-model-name-check.dto'
import type { ProductModelDto } from '../dto/product-model.dto'
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

  async nameCheck(brandId: string, name: string): Promise<ProductModelNameCheck> {
    const params = new URLSearchParams({ brand_id: brandId, name })
    const response = await this.datasource.get<ProductModelNameCheckDto>(
      `/product-models/name-check?${params.toString()}`,
    )
    return ProductModelMapper.toNameCheck(response)
  }

  async create(input: CreateProductModelInput): Promise<ProductModel> {
    const { name, brandId } = input
    const response = await this.datasource.post<ProductModelDto>('/product-models', {
      name,
      brand_id: brandId,
    })
    return ProductModelMapper.toProductModel(response)
  }

  async update(id: string, input: UpdateProductModelInput): Promise<ProductModel> {
    const { name, brandId } = input
    const response = await this.datasource.put<ProductModelDto>(`/product-models/${id}`, {
      name,
      brand_id: brandId,
    })
    return ProductModelMapper.toProductModel(response)
  }

  async setActive(id: string, active: boolean): Promise<ProductModel> {
    const response = await this.datasource.patch<ProductModelDto>(
      `/product-models/${id}/${active ? 'enable' : 'disable'}`,
    )
    return ProductModelMapper.toProductModel(response)
  }

  async remove(id: string): Promise<void> {
    await this.datasource.delete(`/product-models/${id}`)
  }
}

export const productModelRepository = new ProductModelRepositoryImpl()
