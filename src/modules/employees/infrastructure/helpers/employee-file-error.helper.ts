import Axios from 'axios'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import { BlobErrorHelper } from '../../../shared/infraestructure/errors/blob-error.helper'

const NOT_FOUND_MESSAGE = 'No encontramos ese expediente.'
const GENERIC_MESSAGE = 'No se pudo cargar el expediente.'
const DOWNLOAD_GENERIC_MESSAGE = 'No se pudo descargar el expediente.'
const NOT_FOUND_STATUS = 404

export class EmployeeFileErrorHelper {
  static messageFrom(error: unknown): string {
    if (EmployeeFileErrorHelper.isNotFound(error)) return NOT_FOUND_MESSAGE
    return ApiValidationErrorHelper.messageFrom(error, GENERIC_MESSAGE)
  }

  static downloadMessageFrom(error: unknown): Promise<string> {
    if (EmployeeFileErrorHelper.isNotFound(error)) return Promise.resolve(NOT_FOUND_MESSAGE)
    return BlobErrorHelper.messageFrom(error, DOWNLOAD_GENERIC_MESSAGE)
  }

  static notFoundMessage(): string {
    return NOT_FOUND_MESSAGE
  }

  private static isNotFound(error: unknown): boolean {
    return Axios.isAxiosError(error) && error.response?.status === NOT_FOUND_STATUS
  }
}
