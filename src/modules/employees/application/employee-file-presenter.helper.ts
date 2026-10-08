import type { EmployeeFileEvent } from '../domain/employee-file-event.model'
import type { EmployeeFileItem } from '../domain/employee-file-item.model'

const DATE_SEPARATOR = '·'
const PENDING_VALUE = '·'
const EMPTY_VALUE = '—'

export class EmployeeFilePresenter {
  static dotDate(date: string): string {
    return date.split('-').join(DATE_SEPARATOR)
  }

  static eventTimestamp(event: EmployeeFileEvent): string {
    return `${EmployeeFilePresenter.dotDate(event.date)} · ${event.time}`
  }

  static firstName(name: string): string {
    const [firstWord] = name.trim().split(/\s+/)
    return firstWord === '' || firstWord === undefined ? name : firstWord
  }

  static heroEyebrow(identifier: string): string {
    return `Expediente · ${identifier}`
  }

  static heroTitle(name: string): string {
    return `Expediente de ${EmployeeFilePresenter.firstName(name)}`
  }

  static heroLede(hireDate: string, roleName: string): string {
    return `Ingresó ${EmployeeFilePresenter.dotDate(hireDate)} · ${roleName}. Historial completo de herramientas, asignaciones, devoluciones y capacitaciones.`
  }

  static selectionLabel(count: number, total: number): string {
    return `${count} de ${total} ${count === 1 ? 'seleccionada' : 'seleccionadas'}`
  }

  static metricValue(value: number | null): string {
    return value === null ? PENDING_VALUE : String(value)
  }

  static toolLabel(item: EmployeeFileItem): string {
    const parts = [item.brandName, item.modelName].filter(
      (part): part is string => part != null && part !== '',
    )
    return parts.length === 0 ? EMPTY_VALUE : parts.join(' ')
  }
}
