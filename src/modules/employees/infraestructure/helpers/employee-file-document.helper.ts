import type { EmployeeFileDocumentType } from '../../domain/employee-file-document.model'

const TYPE_LABELS: Record<EmployeeFileDocumentType, string> = {
  resguardo: 'Resguardo',
  devolucion: 'Devolución',
}

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB']
const BYTES_PER_UNIT = 1024

export class EmployeeFileDocumentHelper {
  static typeLabel(type: EmployeeFileDocumentType): string {
    return TYPE_LABELS[type]
  }

  static sizeLabel(sizeBytes: number): string {
    if (sizeBytes <= 0) return `0 ${SIZE_UNITS[0]}`
    const unitIndex = Math.min(
      Math.floor(Math.log(sizeBytes) / Math.log(BYTES_PER_UNIT)),
      SIZE_UNITS.length - 1,
    )
    const value = sizeBytes / BYTES_PER_UNIT ** unitIndex
    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${SIZE_UNITS[unitIndex]}`
  }
}
