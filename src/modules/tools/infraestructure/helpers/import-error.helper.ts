import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'

const GENERIC_MESSAGE = 'No se pudo importar el archivo.'

export class ImportErrorHelper {
  static messageFrom(error: unknown): string {
    return ApiValidationErrorHelper.messageFrom(error, GENERIC_MESSAGE)
  }
}
