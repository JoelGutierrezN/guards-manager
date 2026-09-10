import Axios from 'axios'
import { ApiConflictErrorHelper } from '../../../shared/infraestructure/errors/api-conflict-error.helper'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import { BlobErrorHelper } from '../../../shared/infraestructure/errors/blob-error.helper'
import type { SignErrorReport, SignFieldErrors } from '../../domain/sign-error.model'

interface ValidationErrorBody {
  errors?: Record<string, string[]>
}

const VALIDATION_STATUS = 422
const CONFLICT_STATUS = 409
const NOT_FOUND_STATUS = 404

const GENERIC_MESSAGE = 'No se pudo registrar la firma. Inténtalo de nuevo.'
const VALIDATION_MESSAGE = 'Revisa los datos marcados.'
const CONFLICT_MESSAGE = 'Esta hoja ya está firmada.'
const NOT_FOUND_MESSAGE = 'No encontramos el documento que quieres firmar.'
const LOAD_MESSAGE = 'No se pudo cargar el documento para firmar.'
const DOWNLOAD_MESSAGE = 'No se pudo descargar la hoja.'
const EMPTY_SIGNATURE_MESSAGE = 'Traza la firma antes de continuar.'
const EMPTY_SIGNER_MESSAGE = 'Escribe el nombre de quien firma.'

const FIELD_BY_ERROR_KEY: Record<string, keyof SignFieldErrors> = {
  image: 'image',
  signer_name: 'signerName',
}

export class SignErrorHelper {
  static loadMessageFrom(error: unknown): string {
    if (SignErrorHelper.hasStatus(error, NOT_FOUND_STATUS)) return NOT_FOUND_MESSAGE
    return ApiValidationErrorHelper.messageFrom(error, LOAD_MESSAGE)
  }

  static notFoundMessage(): string {
    return NOT_FOUND_MESSAGE
  }

  static isNotFound(message: string | null): boolean {
    return message === NOT_FOUND_MESSAGE
  }

  static reportFrom(error: unknown): SignErrorReport {
    if (SignErrorHelper.hasStatus(error, CONFLICT_STATUS)) {
      const conflict = ApiConflictErrorHelper.reasonsFrom(error, CONFLICT_MESSAGE)
      return {
        message: conflict.message,
        reasons: conflict.reasons,
        fieldErrors: {},
        alreadySigned: true,
      }
    }
    if (SignErrorHelper.hasStatus(error, NOT_FOUND_STATUS)) {
      return SignErrorHelper.plain(NOT_FOUND_MESSAGE)
    }
    if (SignErrorHelper.hasStatus(error, VALIDATION_STATUS)) {
      return SignErrorHelper.validationReport(error)
    }
    return SignErrorHelper.plain(GENERIC_MESSAGE)
  }

  static emptySignatureReport(): SignErrorReport {
    return {
      message: VALIDATION_MESSAGE,
      reasons: [],
      fieldErrors: { image: EMPTY_SIGNATURE_MESSAGE },
      alreadySigned: false,
    }
  }

  static emptySignerReport(): SignErrorReport {
    return {
      message: VALIDATION_MESSAGE,
      reasons: [],
      fieldErrors: { signerName: EMPTY_SIGNER_MESSAGE },
      alreadySigned: false,
    }
  }

  static async downloadMessageFrom(error: unknown): Promise<string> {
    return BlobErrorHelper.messageFrom(error, DOWNLOAD_MESSAGE)
  }

  private static plain(message: string): SignErrorReport {
    return { message, reasons: [], fieldErrors: {}, alreadySigned: false }
  }

  private static validationReport(error: unknown): SignErrorReport {
    const body = Axios.isAxiosError(error)
      ? (error.response?.data as ValidationErrorBody | undefined)
      : undefined
    const fieldErrors: SignFieldErrors = {}
    const reasons: string[] = []

    Object.entries(body?.errors ?? {}).forEach(([key, messages]) => {
      const [firstMessage] = messages
      if (typeof firstMessage !== 'string') return
      const field = FIELD_BY_ERROR_KEY[key]
      if (field === undefined) {
        reasons.push(firstMessage)
        return
      }
      fieldErrors[field] = firstMessage
    })

    const hasDetail = Object.keys(fieldErrors).length > 0
    return {
      message: hasDetail
        ? VALIDATION_MESSAGE
        : ApiValidationErrorHelper.messageFrom(error, GENERIC_MESSAGE),
      reasons,
      fieldErrors,
      alreadySigned: false,
    }
  }

  private static hasStatus(error: unknown, status: number): boolean {
    return Axios.isAxiosError(error) && error.response?.status === status
  }
}
