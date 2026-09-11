import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'

const GENERIC_MESSAGE = 'No se pudo guardar el usuario.'

export class UserFormErrorHelper {
  static messageFrom(error: unknown): string {
    return ApiValidationErrorHelper.messageFrom(error, GENERIC_MESSAGE)
  }
}
