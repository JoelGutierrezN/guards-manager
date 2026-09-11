import type { EmployeeFileDocumentType } from '../../domain/employee-file-document.model'

const TYPE_LABELS: Record<EmployeeFileDocumentType, string> = {
  resguardo: 'Resguardo',
  devolucion: 'Devolución',
}

export class EmployeeFileDocumentHelper {
  static typeLabel(type: EmployeeFileDocumentType): string {
    return TYPE_LABELS[type]
  }
}
