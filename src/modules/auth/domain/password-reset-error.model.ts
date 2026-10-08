export interface PasswordResetFieldErrors {
  email?: string
  password?: string
}

/** Error de recuperar/restablecer contraseña listo para pintar: mensaje general y errores por campo del 422. */
export interface PasswordResetErrorReport {
  message: string
  fieldErrors: PasswordResetFieldErrors
}
