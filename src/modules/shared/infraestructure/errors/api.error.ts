import { AppError } from './app.error.handler'

export class ApiError extends AppError {
  constructor (message = 'API Error', status?: number, details?: unknown) {
    super({
      message,
      code: 'API_ERROR',
      status,
      details
    })
  }
}
