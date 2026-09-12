import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type {
  ImportBatch,
  ImportBatchError,
  ImportBatchStatus,
} from '../../domain/import-batch.entity'
import type { ImportAuditEntry, ImportEntityType } from '../../domain/import-audit-entry.entity'
import type { ImportBatchesPage } from '../../domain/import-batches-page.model'
import type {
  ImportAuditEntryDto,
  ImportBatchCollectionDto,
  ImportBatchDto,
  ImportBatchErrorDto,
} from '../dto/import-batch.dto'

const BATCH_STATUSES: ImportBatchStatus[] = ['pending', 'processing', 'completed', 'failed']
const ENTITY_TYPES: ImportEntityType[] = ['brand', 'productModel']
const DEFAULT_STATUS: ImportBatchStatus = 'pending'
const DEFAULT_ENTITY_TYPE: ImportEntityType = 'brand'

export class ImportMapper {
  static toStatus(value: string): ImportBatchStatus {
    const status = BATCH_STATUSES.find((candidate) => candidate === value)
    return status ?? DEFAULT_STATUS
  }

  static toEntityType(value: string): ImportEntityType {
    const entityType = ENTITY_TYPES.find((candidate) => candidate === value)
    return entityType ?? DEFAULT_ENTITY_TYPE
  }

  static toAuditEntry(dto: ImportAuditEntryDto): ImportAuditEntry {
    return {
      id: dto.id,
      rowNumber: dto.rowNumber,
      entityType: ImportMapper.toEntityType(dto.entityType),
      createdId: dto.createdId,
      createdName: dto.createdName,
      candidateId: dto.candidateId,
      candidateName: dto.candidateName,
      similarity: dto.similarity,
      resolved: dto.resolved,
    }
  }

  static toBatchError(dto: ImportBatchErrorDto): ImportBatchError {
    return { row: dto.row, message: dto.message }
  }

  static toBatch(dto: ImportBatchDto): ImportBatch {
    return {
      id: dto.id,
      status: ImportMapper.toStatus(dto.status),
      originalFilename: dto.originalFilename,
      totalRows: dto.totalRows,
      processedRows: dto.processedRows,
      createdCount: dto.createdCount,
      reusedCount: dto.reusedCount,
      fuzzyCount: dto.fuzzyCount,
      errorCount: dto.errorCount,
      errors: (dto.errors ?? []).map((error) => ImportMapper.toBatchError(error)),
      auditEntries: (dto.auditEntries ?? []).map((entry) => ImportMapper.toAuditEntry(entry)),
      createdAt: dto.createdAt,
    }
  }

  static toBatchesPage(dto: ImportBatchCollectionDto): ImportBatchesPage {
    return {
      ...PaginationMapper.toPagination(dto.meta),
      batches: dto.data.map((batch) => ImportMapper.toBatch(batch)),
    }
  }
}
