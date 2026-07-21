import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { BrandRepository as BrandRepositoryContract } from '../../domain/brand-repository'
import type { Brand } from '../../domain/brand.entity'
import type { BrandPage } from '../../domain/brand-page.model'
import type { CreateBrandInput, UpdateBrandInput } from '../../domain/brand-input.model'
import type { BrandCollectionDto, BrandResourceDto } from '../dto/brand-collection.dto'
import { BrandMapper } from '../mappers/brand.mapper'

class BrandRepositoryImpl implements BrandRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async list(page: number, name?: string): Promise<BrandPage> {
    const params = new URLSearchParams({ page: String(page) })
    if (name && name.trim() !== '') {
      params.set('name', name.trim())
    }
    const response = await this.datasource.get<BrandCollectionDto>(`/brands?${params.toString()}`)
    return BrandMapper.toBrandPage(response)
  }

  async create(input: CreateBrandInput): Promise<Brand> {
    const response = await this.datasource.post<BrandResourceDto>('/brands', input)
    return BrandMapper.toBrand(response.data)
  }

  async update(id: string, input: UpdateBrandInput): Promise<Brand> {
    const response = await this.datasource.put<BrandResourceDto>(`/brands/${id}`, input)
    return BrandMapper.toBrand(response.data)
  }
}

export const brandRepository = new BrandRepositoryImpl()
