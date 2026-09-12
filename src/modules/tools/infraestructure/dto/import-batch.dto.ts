import type { PaginationMetaDto } from '../../../shared/infraestructure/dto/pagination-meta.dto'

export interface ImportAuditEntryDto {
  id: string
  rowNumber: number
  entityType: string
  createdId: string
  candidateId: string | null
  similarity: number
  resolved: boolean
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
  errors?: string[]
  auditEntries?: ImportAuditEntryDto[]
  createdAt: string
}

export interface ImportBatchCollectionDto {
  data: ImportBatchDto[]
  meta: PaginationMetaDto
}
