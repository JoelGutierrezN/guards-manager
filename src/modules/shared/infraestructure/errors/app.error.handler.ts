export class AppError extends Error {
  public readonly code: string
  public readonly status?: number
  public readonly details?: unknown

  constructor ({
    message,
    code,
    status,
    details
  }: {
    message: string
    code: string
    status?: number
    details?: unknown
  }) {
    super(message)

    this.name = this.constructor.name
    this.code = code
    this.status = status
    this.details = details

    Error.captureStackTrace?.(this, this.constructor)
  }
}
