import type { CreateCustodyInput } from './custody-input.model'
import type { CustodiesListPage } from './custodies-list-page.model'
import type { CustodyDetail } from './custody.entity'
import type { CreateReturnInput } from './return-input.model'
import type { CustodyReturn } from './return.entity'
import type { ReturnsListPage } from './returns-list-page.model'

export interface CustodiesRepository {
  list(params: URLSearchParams): Promise<CustodiesListPage>
  get(custodyId: string): Promise<CustodyDetail>
  create(input: CreateCustodyInput): Promise<CustodyDetail>
  cancel(custodyId: string): Promise<void>
  createReturn(custodyId: string, input: CreateReturnInput): Promise<CustodyReturn>
  listReturns(custodyId: string, page: number): Promise<ReturnsListPage>
}
