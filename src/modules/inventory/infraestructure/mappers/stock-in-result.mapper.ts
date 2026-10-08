import type { StockInResult } from '../../domain/stock-in-result.model'
import type { StockBulkResponseDto } from '../dto/stock-bulk.dto'

export class StockInResultMapper {
  static toStockInResult(dto: StockBulkResponseDto): StockInResult {
    return {
      createdCount: dto.created.length,
      range: { from: dto.range.from, to: dto.range.to },
      product: {
        id: dto.product.id,
        name: dto.product.name,
        total: dto.product.total,
        available: dto.product.available,
        assigned: dto.product.assigned,
        unusable: dto.product.unusable,
      },
    }
  }
}
