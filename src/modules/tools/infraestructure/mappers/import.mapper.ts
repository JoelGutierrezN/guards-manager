import { PaginationMapper } from '../../../shared/infraestructure/mappers/pagination.mapper'
import type { ImportBatch, ImportBatchStatus } from '../../domain/import-batch.entity'
import type { ImportAuditEntry, ImportEntityType } from '../../domain/import-audit-entry.entity'
import type { ImportBatchesPage } from '../../domain/import-batches-page.model'
import type {
  ImportAuditEntryDto,
  ImportBatchCollectionDto,
  ImportBatchDto,
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
      candidateId: dto.candidateId,
      similarity: dto.similarity,
      resolved: dto.resolved,
    }
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
      errors: dto.errors ?? [],
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
