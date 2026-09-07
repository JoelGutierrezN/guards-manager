import { HttpDataSource } from '../../../shared/infraestructure/datasource/http.datasource'
import type {
  StockUnitsRepository as StockUnitsRepositoryContract,
  StockUnitsListParams,
} from '../../domain/stock-units-repository'
import type { ToolUnit } from '../../domain/tool-unit.model'
import type { StockUnitsListPage } from '../../domain/stock-units-list-page.model'
import type { ItemCondition } from '../../../shared/domain/item-condition.model'
import type { StockUnitCollectionDto, StockUnitDto } from '../dto/stock-unit.dto'
import { StockUnitMapper } from '../mappers/stock-unit.mapper'

class StockUnitsRepositoryImpl implements StockUnitsRepositoryContract {
  private readonly datasource: HttpDataSource

  constructor() {
    this.datasource = HttpDataSource.getInstance()
  }

  async list(params: StockUnitsListParams): Promise<StockUnitsListPage> {
    const searchParams = new URLSearchParams({
      product_id: params.productId,
      status: params.status,
      page: String(params.page),
      per_page: String(params.perPage),
    })
    const trimmedQuery = params.query.trim()
    if (trimmedQuery !== '') {
      searchParams.set('q', trimmedQuery)
    }

    const response = await this.datasource.get<StockUnitCollectionDto>(
      `/stocks?${searchParams.toString()}`,
    )
    return StockUnitMapper.toStockUnitsListPage(response)
  }

  async updateCondition(stockId: string, condition: ItemCondition): Promise<ToolUnit> {
    const response = await this.datasource.patch<StockUnitDto>(`/stocks/${stockId}`, {
      condition,
    })
    return StockUnitMapper.toToolUnit(response)
  }

  async remove(stockId: string): Promise<void> {
    await this.datasource.delete<void>(`/stocks/${stockId}`)
  }
}

export const stockUnitsRepository = new StockUnitsRepositoryImpl()
