import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { CustodiesRepository as CustodiesRepositoryContract } from '../../domain/custodies-repository'
import type { CustodiesListPage } from '../../domain/custodies-list-page.model'
import type { CreateCustodyInput } from '../../domain/custody-input.model'
import type { CustodyDetail } from '../../domain/custody.entity'
import type { CustodyCollectionDto, CustodyDetailDto } from '../dto/custody.dto'
import { CustodyMapper } from '../mappers/custody.mapper'

class CustodiesRepositoryImpl implements CustodiesRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async list(params: URLSearchParams): Promise<CustodiesListPage> {
    const response = await this.datasource.get<CustodyCollectionDto>(
      `/custodies?${params.toString()}`,
    )
    return CustodyMapper.toCustodiesListPage(response)
  }

  async get(custodyId: string): Promise<CustodyDetail> {
    const response = await this.datasource.get<CustodyDetailDto>(`/custodies/${custodyId}`)
    return CustodyMapper.toCustodyDetail(response)
  }

  async create(input: CreateCustodyInput): Promise<CustodyDetail> {
    const response = await this.datasource.post<CustodyDetailDto>(
      '/custodies',
      CustodyMapper.toRequestBody(input),
    )
    return CustodyMapper.toCustodyDetail(response)
  }

  async cancel(custodyId: string): Promise<void> {
    await this.datasource.delete<void>(`/custodies/${custodyId}`)
  }
}

export const custodiesRepository = new CustodiesRepositoryImpl()
