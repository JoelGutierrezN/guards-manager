import {
  ItemsErrorReportHelper,
  type ItemsErrorMessages,
} from '../../../shared/infraestructure/errors/items-error-report.helper'
import type { ReturnErrorReport, ReturnFieldErrors } from '../../domain/return-error.model'

type ReturnField = keyof ReturnFieldErrors

const VALIDATION_MESSAGE = 'Revisa los datos marcados.'
const NOT_FOUND_MESSAGE = 'Este resguardo ya no admite devoluciones.'
const MISSING_NOTE_MESSAGE = 'Explica en la nota por qué la unidad regresa en esta condición.'
const NO_SELECTION_MESSAGE = 'Selecciona al menos una unidad para devolver.'

const MESSAGES: ItemsErrorMessages<ReturnField> = {
  generic: 'No se pudo registrar la devolución. Inténtalo de nuevo.',
  validation: VALIDATION_MESSAGE,
  conflict: 'No se pudo registrar la devolución por una regla del negocio.',
  notFound: NOT_FOUND_MESSAGE,
  fieldByErrorKey: { items: 'items', notes: 'notes' },
}

export class ReturnErrorHelper {
  static reportFrom(error: unknown, stockIds: readonly string[]): ReturnErrorReport {
    return ItemsErrorReportHelper.reportFrom(error, stockIds, MESSAGES)
  }

  /** Un 404 al enviar significa que el resguardo dejó de admitir devoluciones. */
  static isNotFound(error: unknown): boolean {
    return ItemsErrorReportHelper.isNotFound(error)
  }

  static notFoundMessage(): string {
    return NOT_FOUND_MESSAGE
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
}
