export type ImportEntityType = 'brand' | 'productModel'

export type ImportAuditEntryAction = 'keep' | 'discard'

export interface ImportAuditEntry {
  id: string
  rowNumber: number
  entityType: ImportEntityType
  createdId: string
  candidateId: string | null
  similarity: number
  resolved: boolean
}
