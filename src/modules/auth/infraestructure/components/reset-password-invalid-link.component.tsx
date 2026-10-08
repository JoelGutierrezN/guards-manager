import { type JSX } from 'react'
import { Link } from 'react-router'

export function ResetPasswordInvalidLink(): JSX.Element {
  return (
    <div className="space-y-6 text-center">
      <h2 className="font-serif text-2xl tracking-tight text-ink">Enlace inválido</h2>
      <p className="text-muted">
        El enlace para restablecer tu contraseña es incompleto o ya no es válido.
      </p>
      <Link to="/forgot-password" className="text-sm font-medium text-brand hover:underline">
        Solicitar un enlace nuevo
      </Link>
    </div>
  )
}
