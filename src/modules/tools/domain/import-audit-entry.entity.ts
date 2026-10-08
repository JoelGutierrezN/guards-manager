export type ImportEntityType = 'brand' | 'productModel'

export type ImportAuditEntryAction = 'keep' | 'discard'

export interface ImportAuditEntry {
  id: string
  rowNumber: number
  entityType: ImportEntityType
  createdId: string
  /** Nombre ya resuelto por el API; `null` si la entidad creada ya no existe. */
  createdName: string | null
  candidateId: string | null
  /** Nombre ya resuelto por el API; `null` si el candidato ya no existe. */
  candidateName: string | null
  similarity: number
  resolved: boolean
}
