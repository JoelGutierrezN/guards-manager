export type EmployeeFileDocumentType = 'resguardo' | 'devolucion'

export interface EmployeeFileDocument {
  id: string
  type: EmployeeFileDocumentType
  code: string
  title: string
  sizeBytes: number
  createdAt: string
  url: string
}
