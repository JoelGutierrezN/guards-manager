import Axios from 'axios'
import { ApiConflictErrorHelper } from '../../../shared/infraestructure/errors/api-conflict-error.helper'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { StockInErrorReport, StockInFieldErrors } from '../../domain/stock-in-error.model'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

const GENERIC_MESSAGE = 'No se pudo registrar el ingreso. Inténtalo de nuevo.'
const VALIDATION_MESSAGE = 'Revisa los datos marcados.'
const NOT_FOUND_MESSAGE = 'El producto ya no existe. Elige otro producto.'
const LOAD_PRODUCT_MESSAGE = 'No se pudo cargar el producto.'
const CONFLICT_FALLBACK_MESSAGE = 'No se pudo registrar el ingreso por una regla del negocio.'

const FIELD_BY_ERROR_KEY: Record<string, keyof StockInFieldErrors> = {
  quantity: 'quantity',
  condition: 'condition',
  product: 'product',
  product_id: 'product',
}

export class StockInErrorHelper {
  static reportFrom(error: unknown): StockInErrorReport {
    if (!Axios.isAxiosError(error)) {
      return { message: GENERIC_MESSAGE, reasons: [], fieldErrors: {} }
    }

    const status = error.response?.status
    if (status === 422) return StockInErrorHelper.validationReport(error.response?.data)
    if (status === 409) {
      const conflict = ApiConflictErrorHelper.reasonsFrom(error, CONFLICT_FALLBACK_MESSAGE)
      return { message: conflict.message, reasons: conflict.reasons, fieldErrors: {} }
    }
    if (status === 404) {
      return {
        message: NOT_FOUND_MESSAGE,
        reasons: [],
        fieldErrors: { product: NOT_FOUND_MESSAGE },
      }
    }

    return { message: GENERIC_MESSAGE, reasons: [], fieldErrors: {} }
  }

  static loadProductReport(error: unknown): StockInErrorReport {
    const report = StockInErrorHelper.reportFrom(error)
    if (report.message === GENERIC_MESSAGE) {
      return { ...report, message: LOAD_PRODUCT_MESSAGE }
    }
    return report
  }

  private static validationReport(body: unknown): StockInErrorReport {
    const validation = body as ValidationErrorBody | undefined
    const fieldErrors: StockInFieldErrors = {}
    const reasons: string[] = []

    Object.entries(validation?.errors ?? {}).forEach(([key, messages]) => {
      const [firstMessage] = messages
      if (typeof firstMessage !== 'string') return
      const field = FIELD_BY_ERROR_KEY[key]
      if (field) {
        fieldErrors[field] = firstMessage
        return
      }
      reasons.push(firstMessage)
    })

    const hasFieldErrors = Object.keys(fieldErrors).length > 0
    const message = hasFieldErrors
      ? VALIDATION_MESSAGE
      : ApiValidationErrorHelper.messageFromBody(body, GENERIC_MESSAGE)

    return { message, reasons, fieldErrors }
  }
}
