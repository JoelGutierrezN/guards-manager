import type { Brand } from './brand.entity'
import type { BrandPage } from './brand-page.model'
import type { CreateBrandInput, UpdateBrandInput } from './brand-input.model'
import type { BrandSelectOption } from './brand-select.model'

export interface BrandRepository {
  list(page: number, name?: string): Promise<BrandPage>
  select(): Promise<BrandSelectOption[]>
  create(input: CreateBrandInput): Promise<Brand>
  update(id: string, input: UpdateBrandInput): Promise<Brand>
}
