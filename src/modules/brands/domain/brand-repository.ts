import type { Brand } from './brand.entity'
import type { BrandPage } from './brand-page.model'
import type { CreateBrandInput, UpdateBrandInput } from './brand-input.model'

export interface BrandRepository {
  list(page: number, name?: string): Promise<BrandPage>
  create(input: CreateBrandInput): Promise<Brand>
  update(id: string, input: UpdateBrandInput): Promise<Brand>
}
