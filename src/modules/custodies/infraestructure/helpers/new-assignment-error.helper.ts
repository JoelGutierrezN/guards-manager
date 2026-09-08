import Axios from 'axios'
import { ApiConflictErrorHelper } from '../../../shared/infraestructure/errors/api-conflict-error.helper'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type {
  NewAssignmentErrorReport,
  NewAssignmentFieldErrors,
} from '../../domain/new-assignment-error.model'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

const VALIDATION_STATUS = 422
const CONFLICT_STATUS = 409
const NOT_FOUND_STATUS = 404

const GENERIC_MESSAGE = 'No se pudo crear el resguardo. Inténtalo de nuevo.'
const VALIDATION_MESSAGE = 'Revisa los datos marcados.'
const CONFLICT_MESSAGE = 'No se pudo crear el resguardo por una regla del negocio.'
const NOT_FOUND_MESSAGE = 'Alguno de los datos elegidos ya no existe. Vuelve a intentarlo.'
const EMPLOYEE_LOAD_MESSAGE = 'No se pudo cargar el empleado indicado.'
const UNITS_LOAD_MESSAGE = 'No se pudieron cargar las unidades disponibles.'

const ITEM_ERROR_KEY_PATTERN = /^items\.(\d+)\./
const FIELD_BY_ERROR_KEY: Record<string, keyof NewAssignmentFieldErrors> = {
  employee_id: 'employee',
  items: 'items',
  notes: 'notes',
}

export class NewAssignmentErrorHelper {
  static reportFrom(error: unknown, stockIds: string[]): NewAssignmentErrorReport {
    if (!Axios.isAxiosError(error)) return NewAssignmentErrorHelper.plain(GENERIC_MESSAGE)

    const status = error.response?.status
    if (status === VALIDATION_STATUS) {
      return NewAssignmentErrorHelper.validationReport(error.response?.data, stockIds)
    }
    if (status === CONFLICT_STATUS) {
      const conflict = ApiConflictErrorHelper.reasonsFrom(error, CONFLICT_MESSAGE)
      return { ...NewAssignmentErrorHelper.plain(conflict.message), reasons: conflict.reasons }
    }
    if (status === NOT_FOUND_STATUS) return NewAssignmentErrorHelper.plain(NOT_FOUND_MESSAGE)

    return NewAssignmentErrorHelper.plain(GENERIC_MESSAGE)
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

  private static plain(message: string): NewAssignmentErrorReport {
    return { message, reasons: [], fieldErrors: {}, itemErrors: {} }
  }

  private static validationReport(body: unknown, stockIds: string[]): NewAssignmentErrorReport {
    const validation = body as ValidationErrorBody | undefined
    const fieldErrors: NewAssignmentFieldErrors = {}
    const itemErrors: Record<string, string> = {}
    const reasons: string[] = []

    Object.entries(validation?.errors ?? {}).forEach(([key, messages]) => {
      const [firstMessage] = messages
      if (typeof firstMessage !== 'string') return

      const stockId = NewAssignmentErrorHelper.stockIdOf(key, stockIds)
      if (stockId !== null) {
        itemErrors[stockId] = firstMessage
        return
      }

      const field = FIELD_BY_ERROR_KEY[key]
      if (field) {
        fieldErrors[field] = firstMessage
        return
      }
      reasons.push(firstMessage)
    })

    const hasDetail = Object.keys(fieldErrors).length > 0 || Object.keys(itemErrors).length > 0
    const message = hasDetail
      ? VALIDATION_MESSAGE
      : ApiValidationErrorHelper.messageFromBody(body, GENERIC_MESSAGE)

    return { message, reasons, fieldErrors, itemErrors }
  }

  /** `items.{i}.stock_id` apunta a la posición del carrito con la que se armó la petición. */
  private static stockIdOf(errorKey: string, stockIds: string[]): string | null {
    const match = ITEM_ERROR_KEY_PATTERN.exec(errorKey)
    if (match === null) return null
    return stockIds[Number(match[1])] ?? null
  }
}
