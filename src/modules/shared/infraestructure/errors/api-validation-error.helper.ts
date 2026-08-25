import Axios from 'axios'

interface ValidationErrorBody {
  message?: string
  errors?: Record<string, string[]>
}

export class ApiValidationErrorHelper {
  static messageFrom(error: unknown, fallback: string): string {
    if (!Axios.isAxiosError(error)) return fallback
    const body = error.response?.data as ValidationErrorBody | undefined
    const fieldMessages = body?.errors != null ? Object.values(body.errors).flat() : []
    const [firstFieldMessage] = fieldMessages
    if (typeof firstFieldMessage === 'string' && firstFieldMessage !== '') return firstFieldMessage
    if (typeof body?.message === 'string' && body.message !== '') return body.message
    return fallback
  }
}
