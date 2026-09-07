import Axios from 'axios'
import type { ApiConflictDetail } from './api-conflict.model'

interface ConflictErrorBody {
  message?: string
  reasons?: string[]
}

const CONFLICT_STATUS = 409

/** Los 409 del API explican el bloqueo en `reasons`; sin este helper se pierden. */
export class ApiConflictErrorHelper {
  static isConflict(error: unknown): boolean {
    return Axios.isAxiosError(error) && error.response?.status === CONFLICT_STATUS
  }

  static reasonsFrom(error: unknown, fallback: string): ApiConflictDetail {
    if (!Axios.isAxiosError(error)) return { message: fallback, reasons: [] }

    const body = error.response?.data as ConflictErrorBody | undefined
    const message =
      typeof body?.message === 'string' && body.message !== '' ? body.message : fallback
    const reasons = Array.isArray(body?.reasons)
      ? body.reasons.filter((reason): reason is string => typeof reason === 'string')
      : []

    return { message, reasons }
  }

  /** Mensaje listo para un toast: el motivo del API seguido de sus razones. */
  static messageFrom(error: unknown, fallback: string): string {
    const { message, reasons } = ApiConflictErrorHelper.reasonsFrom(error, fallback)
    if (reasons.length === 0) return message
    return `${message} ${reasons.join(' · ')}`
  }
}
