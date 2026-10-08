import type { Brand } from './brand.entity'
import type { BrandPage } from './brand-page.model'
import type { CreateBrandInput, UpdateBrandInput } from './brand-input.model'
import type { BrandSelectOption } from './brand-select.model'
import type { BrandDeletionPreview } from './brand-deletion-preview.model'

export interface BrandRepository {
  list(page: number, name?: string): Promise<BrandPage>
  select(): Promise<BrandSelectOption[]>
  detail(id: string): Promise<Brand>
  create(input: CreateBrandInput): Promise<Brand>
  update(id: string, input: UpdateBrandInput): Promise<Brand>
  deletionPreview(id: string): Promise<BrandDeletionPreview>
  merge(id: string, targetId: string): Promise<Brand>
  remove(id: string): Promise<void>
}
