import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'
import type { StockUnitDto } from './stock-unit.dto'

export interface SerialCorrectionDto {
  id: string
  previousSerial: string | null
  newSerial: string
  reason: string | null
  createdAt: string
  createdBy: { id: string; name: string }
  custody: { id: string; code: string } | null
  responsible: { id: string; identifier: string; name: string } | null
  receipt: { id: string; filename: string; url: string; sizeBytes: number } | null
}

export interface SerialCorrectionCollectionDto {
  data: SerialCorrectionDto[]
  meta: PaginationMetaDto
}

export interface SerialCorrectionResultDto {
  stock: StockUnitDto
  correction: SerialCorrectionDto
}
