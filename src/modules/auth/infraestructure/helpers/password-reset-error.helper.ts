import Axios from 'axios'
import { ApiValidationErrorHelper } from '../../../shared/infraestructure/errors/api-validation-error.helper'
import type {
  PasswordResetErrorReport,
  PasswordResetFieldErrors,
} from '../../domain/password-reset-error.model'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

const GENERIC_FORGOT_MESSAGE = 'No se pudo enviar el enlace. Inténtalo de nuevo.'
const GENERIC_RESET_MESSAGE = 'No se pudo restablecer la contraseña. Inténtalo de nuevo.'
const EXPIRED_LINK_MESSAGE = 'El enlace ha expirado o ya fue usado. Solicita uno nuevo.'
const VALIDATION_MESSAGE = 'Revisa los datos marcados.'

const FIELD_BY_ERROR_KEY: Record<string, keyof PasswordResetFieldErrors> = {
  email: 'email',
  password: 'password',
  password_confirmation: 'password',
}

export class PasswordResetErrorHelper {
  static forgotReportFrom(error: unknown): PasswordResetErrorReport {
    return PasswordResetErrorHelper.reportFrom(error, GENERIC_FORGOT_MESSAGE)
  }

  static resetReportFrom(error: unknown): PasswordResetErrorReport {
    if (!Axios.isAxiosError(error)) return { message: GENERIC_RESET_MESSAGE, fieldErrors: {} }

    const status = error.response?.status
    if (status === 403) {
      const body = error.response?.data as ValidationErrorBody | undefined
      return { message: body?.message ?? EXPIRED_LINK_MESSAGE, fieldErrors: {} }
    }

    return PasswordResetErrorHelper.reportFrom(error, GENERIC_RESET_MESSAGE)
  }

  private static reportFrom(error: unknown, genericMessage: string): PasswordResetErrorReport {
    if (!Axios.isAxiosError(error)) return { message: genericMessage, fieldErrors: {} }

    const status = error.response?.status
    if (status !== 422) return { message: genericMessage, fieldErrors: {} }

    const validation = error.response?.data as ValidationErrorBody | undefined
    const fieldErrors: PasswordResetFieldErrors = {}

    Object.entries(validation?.errors ?? {}).forEach(([key, messages]) => {
      const [firstMessage] = messages
      if (typeof firstMessage !== 'string') return
      const field = FIELD_BY_ERROR_KEY[key]
      if (field) fieldErrors[field] = firstMessage
    })

    const hasFieldErrors = Object.keys(fieldErrors).length > 0
    const message = hasFieldErrors
      ? VALIDATION_MESSAGE
      : ApiValidationErrorHelper.messageFromBody(validation, genericMessage)

    return { message, fieldErrors }
  }
}
