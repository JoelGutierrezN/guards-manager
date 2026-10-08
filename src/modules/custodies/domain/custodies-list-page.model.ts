import type { Pagination } from '../../shared/domain/pagination.model'
import type { Custody } from './custody.entity'
import type { CustodiesStats } from './custodies-stats.entity'

export interface CustodiesListPage extends Pagination {
  custodies: Custody[]
  stats: CustodiesStats
}
