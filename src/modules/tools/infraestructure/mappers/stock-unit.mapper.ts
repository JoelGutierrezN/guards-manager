import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { ToolUnit, StockUnitCustody } from '../../domain/tool-unit.model'
import type { StockUnitsListPage } from '../../domain/stock-units-list-page.model'
import type {
  StockUnitDto,
  StockUnitCollectionDto,
  StockUnitCustodyDto,
} from '../dto/stock-unit.dto'

export class StockUnitMapper {
  static toCustody(dto: StockUnitCustodyDto): StockUnitCustody {
    return {
      id: dto.id,
      code: dto.code,
      employeeId: dto.employeeId,
      employeeName: dto.employeeName,
      employeeIdentifier: dto.employeeIdentifier,
      assignedAt: dto.assignedAt,
    }
  }

  static toToolUnit(dto: StockUnitDto): ToolUnit {
    return {
      id: dto.id,
      consecutive: dto.consecutive,
      condition: dto.condition,
      status: dto.status,
      custody: dto.custody ? StockUnitMapper.toCustody(dto.custody) : null,
      createdAt: dto.createdAt,
    }
  }

  static toStockUnitsListPage(dto: StockUnitCollectionDto): StockUnitsListPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      units: dto.data.map((unit) => StockUnitMapper.toToolUnit(unit)),
    }
  }
}
