import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type { DownloadedFile } from '../../../shared/domain/downloaded-file.model'
import type { CustodiesRepository as CustodiesRepositoryContract } from '../../domain/custodies-repository'
import type { CustodiesListPage } from '../../domain/custodies-list-page.model'
import type { CreateCustodyInput } from '../../domain/custody-input.model'
import type { CustodyDetail } from '../../domain/custody.entity'
import type { CreateReturnInput } from '../../domain/return-input.model'
import type { CustodyReturn } from '../../domain/return.entity'
import type { ReturnsListPage } from '../../domain/returns-list-page.model'
import type { SignSheetInput } from '../../domain/signature-input.model'
import type { SignatureResult } from '../../domain/signature.entity'
import type { CustodyCollectionDto, CustodyDetailDto } from '../dto/custody.dto'
import type { ReturnCollectionDto, ReturnDto } from '../dto/return.dto'
import type { SignatureResultDto } from '../dto/signature.dto'
import { CustodyMapper } from '../mappers/custody.mapper'
import { ReturnMapper } from '../mappers/return.mapper'
import { SignatureMapper } from '../mappers/signature.mapper'

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

  async createReturn(custodyId: string, input: CreateReturnInput): Promise<CustodyReturn> {
    const response = await this.datasource.post<ReturnDto>(
      `/custodies/${custodyId}/returns`,
      ReturnMapper.toRequestBody(input),
    )
    return ReturnMapper.toReturn(response)
  }

  async listReturns(custodyId: string, page: number): Promise<ReturnsListPage> {
    const params = new URLSearchParams({ page: String(page) })
    const response = await this.datasource.get<ReturnCollectionDto>(
      `/custodies/${custodyId}/returns?${params.toString()}`,
    )
    return ReturnMapper.toReturnsListPage(response)
  }

  async getReturn(returnId: string): Promise<CustodyReturn> {
    const response = await this.datasource.get<ReturnDto>(`/returns/${returnId}`)
    return ReturnMapper.toReturn(response)
  }

  async signCustody(custodyId: string, input: SignSheetInput): Promise<SignatureResult> {
    const response = await this.datasource.post<SignatureResultDto>(
      `/custodies/${custodyId}/signature`,
      SignatureMapper.toRequestBody(input),
    )
    return SignatureMapper.toResult(response)
  }

  async signReturn(returnId: string, input: SignSheetInput): Promise<SignatureResult> {
    const response = await this.datasource.post<SignatureResultDto>(
      `/returns/${returnId}/signature`,
      SignatureMapper.toRequestBody(input),
    )
    return SignatureMapper.toResult(response)
  }

  async downloadSheet(url: string, filename: string): Promise<DownloadedFile> {
    return this.datasource.getFile(url, filename)
  }
}

export const custodiesRepository = new CustodiesRepositoryImpl()
