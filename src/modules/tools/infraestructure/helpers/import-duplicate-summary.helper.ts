import type { ImportAuditEntry } from '../../domain/import-audit-entry.entity'

/** El API puede devolver el nombre en `null` cuando la entidad ya no existe. */
const UNKNOWN_NAME = 'registro eliminado'

export class ImportDuplicateSummaryHelper {
  /** Texto de la fila de duplicados: dice qué se fusionaría contra qué antes de decidir. */
  static describe(entry: ImportAuditEntry): string {
    const created = entry.createdName ?? UNKNOWN_NAME
    const candidate = entry.candidateName ?? UNKNOWN_NAME
    return `Fila ${entry.rowNumber} · «${created}» se parece a «${candidate}» (${entry.similarity}% de similitud)`
  }
}
