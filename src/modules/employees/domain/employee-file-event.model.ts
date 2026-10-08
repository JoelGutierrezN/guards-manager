export type EmployeeFileEventType = 'alta' | 'asignacion' | 'devolucion' | 'daño' | 'cancelacion'

export type EmployeeFileEventTone = 'neutral' | 'ok' | 'warn'

export interface EmployeeFileEvent {
  id: string
  type: EmployeeFileEventType
  tone: EmployeeFileEventTone
  title: string
  body: string
  date: string
  time: string
  occurredAt: string
}
