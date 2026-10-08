import type { EmployeeFileDamage } from '../../domain/employee-file-damage.model'

const EMPTY_VALUE = '—'

export class EmployeeFileDamageHelper {
  static toolLabel(damage: EmployeeFileDamage): string {
    const { productName, brandName, modelName } = damage.stock
    const parts = [brandName, modelName].filter(
      (part): part is string => part != null && part !== '',
    )
    return parts.length === 0 ? productName : `${productName} · ${parts.join(' ')}`
  }

  static notesLabel(damage: EmployeeFileDamage): string {
    return damage.notes ?? EMPTY_VALUE
  }

  static hasSheet(damage: EmployeeFileDamage): boolean {
    return damage.sheetUrl !== null
  }
}
