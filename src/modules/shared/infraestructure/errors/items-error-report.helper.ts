import Axios from 'axios'
import { ApiConflictErrorHelper } from './api-conflict-error.helper'
import { ApiValidationErrorHelper } from './api-validation-error.helper'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

/**
 * Error de un formulario con lista de unidades listo para pintar: mensaje general, razones
 * del 409, errores por campo del 422 y errores por unidad (`items.{i}.*` traducido a su
 * `stockId`). Lo comparten la nueva asignación y la devolución.
 */
export interface ItemsErrorReport<TField extends string> {
  message: string
  reasons: string[]
  fieldErrors: Partial<Record<TField, string>>
  itemErrors: Record<string, string>
}

/** Textos y mapa de campos con los que cada pantalla configura el reporte. */
export interface ItemsErrorMessages<TField extends string> {
  generic: string
  validation: string
  conflict: string
  notFound: string
  fieldByErrorKey: Record<string, TField>
}

const VALIDATION_STATUS = 422
const CONFLICT_STATUS = 409
const NOT_FOUND_STATUS = 404

const ITEM_ERROR_KEY_PATTERN = /^items\.(\d+)\./

export class ItemsErrorReportHelper {
  static isNotFound(error: unknown): boolean {
    return Axios.isAxiosError(error) && error.response?.status === NOT_FOUND_STATUS
  }

  static reportFrom<TField extends string>(
    error: unknown,
    stockIds: readonly string[],
    messages: ItemsErrorMessages<TField>,
  ): ItemsErrorReport<TField> {
    if (!Axios.isAxiosError(error)) return ItemsErrorReportHelper.plain<TField>(messages.generic)

    const status = error.response?.status
    if (status === VALIDATION_STATUS) {
      return ItemsErrorReportHelper.validationReport(error.response?.data, stockIds, messages)
    }
    if (status === CONFLICT_STATUS) {
      const conflict = ApiConflictErrorHelper.reasonsFrom(error, messages.conflict)
      return {
        ...ItemsErrorReportHelper.plain<TField>(conflict.message),
        reasons: conflict.reasons,
      }
    }
    if (status === NOT_FOUND_STATUS) return ItemsErrorReportHelper.plain<TField>(messages.notFound)

    return ItemsErrorReportHelper.plain<TField>(messages.generic)
  }

  static plain<TField extends string>(message: string): ItemsErrorReport<TField> {
    return { message, reasons: [], fieldErrors: {}, itemErrors: {} }
  }

  private static validationReport<TField extends string>(
    body: unknown,
    stockIds: readonly string[],
    messages: ItemsErrorMessages<TField>,
  ): ItemsErrorReport<TField> {
    const validation = body as ValidationErrorBody | undefined
    const fieldErrors: Partial<Record<TField, string>> = {}
    const itemErrors: Record<string, string> = {}
    const reasons: string[] = []

    Object.entries(validation?.errors ?? {}).forEach(([key, fieldMessages]) => {
      const [firstMessage] = fieldMessages
      if (typeof firstMessage !== 'string') return

      const stockId = ItemsErrorReportHelper.stockIdOf(key, stockIds)
      if (stockId !== null) {
        itemErrors[stockId] = firstMessage
        return
      }

      const field = messages.fieldByErrorKey[key]
      if (field) {
        fieldErrors[field] = firstMessage
        return
      }
      reasons.push(firstMessage)
    })

    const hasDetail = Object.keys(fieldErrors).length > 0 || Object.keys(itemErrors).length > 0
    const message = hasDetail
      ? messages.validation
      : ApiValidationErrorHelper.messageFromBody(body, messages.generic)

    return { message, reasons, fieldErrors, itemErrors }
  }

  /** `items.{i}.stock_id` apunta a la posición con la que se armó la petición. */
  private static stockIdOf(errorKey: string, stockIds: readonly string[]): string | null {
    const match = ITEM_ERROR_KEY_PATTERN.exec(errorKey)
    if (match === null) return null
    return stockIds[Number(match[1])] ?? null
  }
}
