export type EmployeeFileEventType = 'alta' | 'asignacion' | 'devolucion'

export interface EmployeeFileEvent {
  id: string
  type: EmployeeFileEventType
  title: string
  body: string
  date: string
  time: string
  occurredAt: string
}
