import type { ImportEntityType } from '../../domain/import-audit-entry.entity'

const LABELS: Record<ImportEntityType, string> = {
  brand: 'Marca',
  productModel: 'Modelo',
}

export class ImportEntityTypeHelper {
  static label(entityType: ImportEntityType): string {
    return LABELS[entityType]
  }
}
