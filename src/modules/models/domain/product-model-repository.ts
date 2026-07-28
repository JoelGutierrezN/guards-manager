import type { ProductModel } from './product-model.entity'
import type { ProductModelPage } from './product-model-page.model'
import type { CreateProductModelInput, UpdateProductModelInput } from './product-model-input.model'

export interface ProductModelRepository {
  list(params: URLSearchParams): Promise<ProductModelPage>
  create(input: CreateProductModelInput): Promise<ProductModel>
  update(id: string, input: UpdateProductModelInput): Promise<ProductModel>
  setActive(id: string, active: boolean): Promise<ProductModel>
  remove(id: string): Promise<void>
}
