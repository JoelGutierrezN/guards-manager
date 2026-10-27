import Axios from 'axios'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { SerialCorrectionErrors } from '../../domain/serial-correction.model'

export class SerialCorrectionErrorHelper {
  static from(error: unknown): SerialCorrectionErrors {
    const message = ApiValidationErrorHelper.messageFrom(
      error,
      'No se pudo corregir la serie. Inténtalo de nuevo.',
    )
    if (!Axios.isAxiosError(error)) return { message, stale: false }
    const body = error.response?.data
    if (error.response?.status === 409) {
      return {
        message: `${message} Revisa la serie actual y confirma de nuevo.`,
        stale: true,
        currentSerial: body?.currentSerial ?? null,
      }
    }
    return {
      message,
      stale: false,
      serial: body?.errors?.serial?.[0],
      reason: body?.errors?.reason?.[0],
    }
  }
}
