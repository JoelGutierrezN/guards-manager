import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface ImportAuditEntryDto {
  id: string
  rowNumber: number
  entityType: string
  createdId: string
  createdName: string | null
  candidateId: string | null
  candidateName: string | null
  similarity: number
  resolved: boolean
}

/** `errors` del API es una lista de objetos `{ row, message }`, nunca de cadenas (5.14). */
export interface ImportBatchErrorDto {
  row: number
  message: string
}

export interface ImportBatchDto {
  id: string
  status: string
  originalFilename: string
  totalRows: number
  processedRows: number
  createdCount: number
  reusedCount: number
  fuzzyCount: number
  errorCount: number
  errors?: ImportBatchErrorDto[]
  auditEntries?: ImportAuditEntryDto[]
  createdAt: string
}

export interface ImportBatchCollectionDto {
  data: ImportBatchDto[]
  meta: PaginationMetaDto
}
