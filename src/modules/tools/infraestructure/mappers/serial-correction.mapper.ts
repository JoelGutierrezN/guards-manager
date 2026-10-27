import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type {
  SerialCorrection,
  SerialCorrectionResult,
  SerialCorrectionsPage,
} from '../../domain/serial-correction.model'
import type {
  SerialCorrectionCollectionDto,
  SerialCorrectionDto,
  SerialCorrectionResultDto,
} from '../dto/serial-correction.dto'
import { StockUnitMapper } from './stock-unit.mapper'

export class SerialCorrectionMapper {
  static toCorrection(dto: SerialCorrectionDto): SerialCorrection {
    return {
      ...dto,
      previousSerial: dto.previousSerial ?? null,
      reason: dto.reason ?? null,
      receipt: dto.receipt ?? null,
    }
  }

  static toPage(dto: SerialCorrectionCollectionDto): SerialCorrectionsPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      corrections: dto.data.map(SerialCorrectionMapper.toCorrection),
    }
  }

  static toResult(dto: SerialCorrectionResultDto): SerialCorrectionResult {
    return {
      stock: StockUnitMapper.toToolUnit(dto.stock),
      correction: SerialCorrectionMapper.toCorrection(dto.correction),
    }
  }
}
