import { useState, type JSX } from 'react'
import { PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../hooks/use-auth.hook'
import { FromLocationHelper } from '../from-location.helper'
import type { FromLocationState } from '../from-location-state.interfaces'
import { Button, Checkbox, FormField, Input } from '../../../shared/infraestructure/components/ui'

export const AuthForm = (): JSX.Element => {
  const { login, status, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as FromLocationState | null
  const [keepSession, setKeepSession] = useState(false)
  const isLoading = status === 'authenticating'

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isLoading) return
    const data = new FormData(event.currentTarget)
    const identifier = data.get('identifier') as string
    const password = data.get('password') as string
    const isAuthenticated = await login(identifier, password, keepSession)
    if (isAuthenticated) {
      navigate(FromLocationHelper.resolvePath(state), { replace: true })
    }
  }

  return (
    <section className="flex min-w-0 flex-col justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">
      <div className="mx-auto w-full max-w-[380px]">
        <div className="mb-12 flex items-center gap-3 lg:hidden">
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-brand text-cream">
            <HugeiconsIcon icon={PackageIcon} size={22} strokeWidth={1.5} />
          </span>
          <span className="text-xl font-semibold tracking-tight">ETTS</span>
        </div>
        <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-brand uppercase">
          Acceso al sistema
        </p>
        <h2 className="m-0 font-display text-[clamp(38px,4vw,48px)] leading-none tracking-[-0.035em] text-ink">
          Bienvenido <span className="text-brand italic">de nuevo.</span>
        </h2>
        <p className="mt-4 mb-8 text-[13px] leading-6 text-ink-3">
          Ingresa tus credenciales para continuar con tu equipo.
        </p>
        <form className="flex w-full flex-col gap-5" onSubmit={handleSubmit} aria-busy={isLoading}>
          <FormField label="Usuario" htmlFor="auth-identifier" required>
            <Input
              id="auth-identifier"
              name="identifier"
              autoComplete="username"
              placeholder="Email, teléfono o usuario"
              required
              disabled={isLoading}
            />
          </FormField>
          <FormField label="Contraseña" htmlFor="auth-password" required>
            <Input
              id="auth-password"
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              placeholder="Ingresa tu contraseña"
              required
              disabled={isLoading}
            />
          </FormField>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Checkbox
              label="Mantener sesión iniciada"
              checked={keepSession}
              disabled={isLoading}
              onChange={(event) => setKeepSession(event.target.checked)}
            />
            <Link
              to="/forgot-password"
              className="rounded text-[12px] font-medium text-brand underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          {error && (
            <p
              className="m-0 rounded-[14px] border border-danger/20 bg-danger-soft px-4 py-3 text-[13px] text-danger"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="mt-1 w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </Button>
        </form>
        <p className="mt-8 mb-0 border-t border-hairline pt-5 text-[11px] leading-5 text-muted">
          Administra tus herramientas y sus resguardos desde un solo lugar.
        </p>
      </div>
    </section>
  )
}
