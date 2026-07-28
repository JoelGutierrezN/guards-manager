import type { ProductModel } from './product-model.entity'
import type { ProductModelPage } from './product-model-page.model'
import type { ProductModelNameCheck } from './product-model-name-check.model'
import type { CreateProductModelInput, UpdateProductModelInput } from './product-model-input.model'

export interface ProductModelRepository {
  list(params: URLSearchParams): Promise<ProductModelPage>
  nameCheck(brandId: string, name: string): Promise<ProductModelNameCheck>
  create(input: CreateProductModelInput): Promise<ProductModel>
  update(id: string, input: UpdateProductModelInput): Promise<ProductModel>
  setActive(id: string, active: boolean): Promise<ProductModel>
  remove(id: string): Promise<void>
}
