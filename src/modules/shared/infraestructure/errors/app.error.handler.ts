export class AppError extends Error {
  public readonly code: string
  public readonly status?: number
  public readonly details?: unknown

  constructor({
    message,
    code,
    status,
    details,
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

    const errorConstructor = Error as unknown as {
      captureStackTrace?: (targetObject: object, constructorOpt?: unknown) => void
    }
    errorConstructor.captureStackTrace?.(this, this.constructor)
  }
}
