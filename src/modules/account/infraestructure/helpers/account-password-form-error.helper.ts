import Axios from 'axios'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type { AccountPasswordFormErrors } from '../../application/account-password-form.model'

const GENERIC_MESSAGE = 'No se pudo cambiar la contraseña.'
const UNPROCESSABLE_STATUS = 422

interface ValidationBody {
  errors?: Record<string, string[]>
}

export class AccountPasswordFormErrorHelper {
  static fieldErrorsFrom(error: unknown): AccountPasswordFormErrors {
    if (!Axios.isAxiosError(error) || error.response?.status !== UNPROCESSABLE_STATUS) return {}

    const body = error.response.data as ValidationBody | undefined
    return {
      currentPassword: AccountPasswordFormErrorHelper.firstMessage(body, 'current_password'),
      password: AccountPasswordFormErrorHelper.firstMessage(body, 'password'),
      passwordConfirmation: AccountPasswordFormErrorHelper.firstMessage(
        body,
        'password_confirmation',
      ),
    }
  }

  static messageFrom(error: unknown): string {
    return ApiValidationErrorHelper.messageFrom(error, GENERIC_MESSAGE)
  }

  private static firstMessage(body: ValidationBody | undefined, field: string): string | undefined {
    const messages = body?.errors?.[field]
    if (!Array.isArray(messages)) return undefined
    const [first] = messages
    return typeof first === 'string' && first !== '' ? first : undefined
  }
}
