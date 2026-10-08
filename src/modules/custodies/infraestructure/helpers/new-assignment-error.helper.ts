import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import {
  ItemsErrorReportHelper,
  type ItemsErrorMessages,
} from '../../../shared/infraestructure/errors/items-error-report.helper'
import type {
  NewAssignmentErrorReport,
  NewAssignmentFieldErrors,
} from '../../domain/new-assignment-error.model'

type NewAssignmentField = keyof NewAssignmentFieldErrors

const EMPLOYEE_LOAD_MESSAGE = 'No se pudo cargar el empleado indicado.'
const UNITS_LOAD_MESSAGE = 'No se pudieron cargar las unidades disponibles.'

const MESSAGES: ItemsErrorMessages<NewAssignmentField> = {
  generic: 'No se pudo crear el resguardo. Inténtalo de nuevo.',
  validation: 'Revisa los datos marcados.',
  conflict: 'No se pudo crear el resguardo por una regla del negocio.',
  notFound: 'Alguno de los datos elegidos ya no existe. Vuelve a intentarlo.',
  fieldByErrorKey: { employee_id: 'employee', items: 'items', notes: 'notes' },
}

export class NewAssignmentErrorHelper {
  static reportFrom(error: unknown, stockIds: readonly string[]): NewAssignmentErrorReport {
    return ItemsErrorReportHelper.reportFrom(error, stockIds, MESSAGES)
  }

  static employeeLoadReport(error: unknown): NewAssignmentErrorReport {
    const message = ApiValidationErrorHelper.messageFrom(error, EMPLOYEE_LOAD_MESSAGE)
    return {
      message,
      reasons: [],
      fieldErrors: { employee: message },
      itemErrors: {},
    }
  }

  /**
   * Motivos que debe pintar el aviso general: los del 409 más los errores de campo que
   * ningún paso del wizard representa (`employee_id`, `items`), que si no quedarían
   * invisibles tras el mensaje genérico «Revisa los datos marcados.».
   */
  static noticeReasons(report: NewAssignmentErrorReport): string[] {
    const { employee, items } = report.fieldErrors
    return [...report.reasons, employee, items].filter(
      (reason): reason is string => reason !== undefined && reason !== '',
    )
  }

  static unitsMessageFrom(error: unknown): string {
    return ApiValidationErrorHelper.messageFrom(error, UNITS_LOAD_MESSAGE)
  }
}
