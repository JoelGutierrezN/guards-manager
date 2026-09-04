import { type JSX } from 'react'
import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useNavigate, useLocation } from 'react-router'
import { useAuth } from '../../hooks/use-auth.hook'
import { FromLocationHelper } from '../from-location.helper'
import type { FromLocationState } from '../from-location-state.interfaces'

export const AuthForm = (): JSX.Element => {
  const { login, status, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as FromLocationState | null

  const isLoading = status === 'authenticating'

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const identifier = data.get('identifier') as string
    const password = data.get('password') as string

    const isAuthenticated = await login(identifier, password)

    if (isAuthenticated) {
      navigate(FromLocationHelper.resolvePath(state), { replace: true })
    }
  }

  return (
    <div className="flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-brand flex items-center justify-center">
              <HugeiconsIcon icon={PackageIcon} strokeWidth={1.5} className="text-cream" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-ink">ETTS</span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-serif tracking-tight text-ink">Bienvenido de nuevo</h2>
            <p className="text-muted">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <Form
            className="flex w-96 flex-col gap-4"
            render={(props) => <form {...props} onSubmit={handleSubmit} />}
          >
            <TextField isRequired name="identifier">
              <Label>Usuario</Label>
              <Input placeholder="Email, teléfono o usuario" />
              <FieldError />
            </TextField>
            <TextField isRequired minLength={8} name="password" type="password">
              <Label>Contraseña</Label>
              <Input placeholder="Ingresa tu contraseña" />
              <FieldError />
            </TextField>

            {error && <p className="text-sm text-danger">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" className="w-full" isDisabled={isLoading}>
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  )
}
