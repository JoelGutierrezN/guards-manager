import type { CreateCustodyInput } from './custody-input.model'
import type { CustodiesListPage } from './custodies-list-page.model'
import type { CustodyDetail } from './custody.entity'

export interface CustodiesRepository {
  list(params: URLSearchParams): Promise<CustodiesListPage>
  get(custodyId: string): Promise<CustodyDetail>
  create(input: CreateCustodyInput): Promise<CustodyDetail>
  cancel(custodyId: string): Promise<void>
}
