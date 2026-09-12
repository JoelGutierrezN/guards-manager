import type { ImportAuditEntry } from './import-audit-entry.entity'

export type ImportBatchStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface ImportBatch {
  id: string
  status: ImportBatchStatus
  originalFilename: string
  totalRows: number
  processedRows: number
  createdCount: number
  reusedCount: number
  fuzzyCount: number
  errorCount: number
  errors: string[]
  auditEntries: ImportAuditEntry[]
  createdAt: string
}
