import Axios from 'axios'
import { ApiConflictErrorHelper } from '../../../shared/infraestructure/errors/api-conflict-error.helper'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { ReturnErrorReport, ReturnFieldErrors } from '../../domain/return-error.model'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

const VALIDATION_STATUS = 422
const CONFLICT_STATUS = 409
const NOT_FOUND_STATUS = 404

const GENERIC_MESSAGE = 'No se pudo registrar la devolución. Inténtalo de nuevo.'
const VALIDATION_MESSAGE = 'Revisa los datos marcados.'
const CONFLICT_MESSAGE = 'No se pudo registrar la devolución por una regla del negocio.'
const NOT_FOUND_MESSAGE = 'Este resguardo ya no admite devoluciones.'
const MISSING_NOTE_MESSAGE = 'Explica en la nota por qué la unidad regresa en esta condición.'
const NO_SELECTION_MESSAGE = 'Selecciona al menos una unidad para devolver.'

const ITEM_ERROR_KEY_PATTERN = /^items\.(\d+)\./
const FIELD_BY_ERROR_KEY: Record<string, keyof ReturnFieldErrors> = {
  items: 'items',
  notes: 'notes',
}

export class ReturnErrorHelper {
  static reportFrom(error: unknown, stockIds: readonly string[]): ReturnErrorReport {
    if (!Axios.isAxiosError(error)) return ReturnErrorHelper.plain(GENERIC_MESSAGE)

    const status = error.response?.status
    if (status === VALIDATION_STATUS) {
      return ReturnErrorHelper.validationReport(error.response?.data, stockIds)
    }
    if (status === CONFLICT_STATUS) {
      const conflict = ApiConflictErrorHelper.reasonsFrom(error, CONFLICT_MESSAGE)
      return { ...ReturnErrorHelper.plain(conflict.message), reasons: conflict.reasons }
    }
    if (status === NOT_FOUND_STATUS) return ReturnErrorHelper.plain(NOT_FOUND_MESSAGE)

    return ReturnErrorHelper.plain(GENERIC_MESSAGE)
  }

  /** Validación en cliente: las condiciones malas exigen nota antes de llamar al API. */
  static missingNotesReport(stockIds: readonly string[]): ReturnErrorReport {
    const itemErrors: Record<string, string> = {}
    stockIds.forEach((stockId) => {
      itemErrors[stockId] = MISSING_NOTE_MESSAGE
    })
    return { message: VALIDATION_MESSAGE, reasons: [], fieldErrors: {}, itemErrors }
  }

  static emptySelectionReport(): ReturnErrorReport {
    return {
      message: NO_SELECTION_MESSAGE,
      reasons: [],
      fieldErrors: { items: NO_SELECTION_MESSAGE },
      itemErrors: {},
    }
  }

  /**
   * Motivos que debe pintar el aviso general: los del 409 más los errores de campo que
   * ninguna fila de la tabla representa (`items`), invisibles tras el mensaje genérico.
   */
  static noticeReasons(report: ReturnErrorReport): string[] {
    return [...report.reasons, report.fieldErrors.items].filter(
      (reason): reason is string => reason !== undefined && reason !== '',
    )
  }

  private static plain(message: string): ReturnErrorReport {
    return { message, reasons: [], fieldErrors: {}, itemErrors: {} }
  }

  private static validationReport(body: unknown, stockIds: readonly string[]): ReturnErrorReport {
    const validation = body as ValidationErrorBody | undefined
    const fieldErrors: ReturnFieldErrors = {}
    const itemErrors: Record<string, string> = {}
    const reasons: string[] = []

    Object.entries(validation?.errors ?? {}).forEach(([key, messages]) => {
      const [firstMessage] = messages
      if (typeof firstMessage !== 'string') return

      const stockId = ReturnErrorHelper.stockIdOf(key, stockIds)
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

  /** `items.{i}.stock_id` apunta a la posición con la que se armó la petición. */
  private static stockIdOf(errorKey: string, stockIds: readonly string[]): string | null {
    const match = ITEM_ERROR_KEY_PATTERN.exec(errorKey)
    if (match === null) return null
    return stockIds[Number(match[1])] ?? null
  }
}
