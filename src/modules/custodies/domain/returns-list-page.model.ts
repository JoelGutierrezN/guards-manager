import type { Pagination } from '../../shared/domain/pagination.model'
import type { CustodyReturn } from './return.entity'

export interface ReturnsListPage extends Pagination {
  returns: CustodyReturn[]
}
