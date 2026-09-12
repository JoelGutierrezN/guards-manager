import { isRouteErrorResponse } from 'react-router'

export class AppErrorDetailHelper {
  static messageFrom(error: unknown): string | null {
    if (isRouteErrorResponse(error)) {
      return `${error.status} — ${error.statusText || error.data}`
    }
    if (error instanceof Error) return error.message
    return null
  }
}
