import Axios from 'axios'
import { ApiConflictErrorHelper } from '../../../shared/infraestructure/errors/api-conflict-error.helper'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { ApiConflictDetail } from '../../../shared/infraestructure/errors/api-conflict.model'

const NOT_FOUND_STATUS = 404
const CONFLICT_STATUS = 409

const LIST_MESSAGE = 'No se pudieron cargar los resguardos.'
const DETAIL_MESSAGE = 'No se pudo cargar el resguardo.'
const NOT_FOUND_MESSAGE = 'No encontramos ese resguardo.'
const CANCEL_MESSAGE = 'No se pudo cancelar el resguardo.'
const CANCEL_CONFLICT_MESSAGE = 'Este resguardo ya no se puede cancelar.'
const CANCEL_NOT_FOUND_MESSAGE = 'Este resguardo ya estaba cancelado.'

export class CustodyErrorHelper {
  static listMessageFrom(error: unknown): string {
    return ApiValidationErrorHelper.messageFrom(error, LIST_MESSAGE)
  }

  static detailMessageFrom(error: unknown): string {
    if (CustodyErrorHelper.hasStatus(error, NOT_FOUND_STATUS)) return NOT_FOUND_MESSAGE
    return ApiValidationErrorHelper.messageFrom(error, DETAIL_MESSAGE)
  }

  static cancelDetailFrom(error: unknown): ApiConflictDetail {
    if (CustodyErrorHelper.hasStatus(error, CONFLICT_STATUS)) {
      return ApiConflictErrorHelper.reasonsFrom(error, CANCEL_CONFLICT_MESSAGE)
    }
    if (CustodyErrorHelper.hasStatus(error, NOT_FOUND_STATUS)) {
      return { message: CANCEL_NOT_FOUND_MESSAGE, reasons: [] }
    }
    return { message: ApiValidationErrorHelper.messageFrom(error, CANCEL_MESSAGE), reasons: [] }
  }

  static notFoundMessage(): string {
    return NOT_FOUND_MESSAGE
  }

  static isNotFound(message: string): boolean {
    return message === NOT_FOUND_MESSAGE
  }

  private static hasStatus(error: unknown, status: number): boolean {
    return Axios.isAxiosError(error) && error.response?.status === status
  }
}
