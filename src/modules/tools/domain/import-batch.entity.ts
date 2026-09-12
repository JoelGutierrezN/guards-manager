import type { ImportAuditEntry } from './import-audit-entry.entity'

export type ImportBatchStatus = 'pending' | 'processing' | 'completed' | 'failed'

/** Fila del archivo que no se pudo importar, con el motivo que devolvió el API. */
export interface ImportBatchError {
  row: number
  message: string
}

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
  errors: ImportBatchError[]
  auditEntries: ImportAuditEntry[]
  createdAt: string
}
