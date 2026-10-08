import type { Pagination } from '../../shared/domain/pagination.model'
import type { ToolUnit } from './tool-unit.model'

export interface StockUnitsListPage extends Pagination {
  units: ToolUnit[]
}
