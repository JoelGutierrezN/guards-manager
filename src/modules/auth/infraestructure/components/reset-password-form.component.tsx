import { type FormEvent, type JSX, useState } from 'react'
import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { Link } from 'react-router'
import { useResetPassword } from '../../hooks/use-reset-password.hook'
import type { ResetPasswordLinkParams } from '../../domain/reset-password-link.model'

interface Props {
  linkParams: ResetPasswordLinkParams
}

const PASSWORD_MISMATCH_MESSAGE = 'Las contraseñas no coinciden.'

export function ResetPasswordForm({ linkParams }: Props): JSX.Element {
  const { state, submit } = useResetPassword(linkParams)
  const [mismatchError, setMismatchError] = useState<string | null>(null)
  const isSubmitting = state.status === 'submitting'
  const isDone = state.status === 'done'

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = formData.get('password') as string
    const passwordConfirmation = formData.get('password_confirmation') as string

    if (password !== passwordConfirmation) {
      setMismatchError(PASSWORD_MISMATCH_MESSAGE)
      return
    }

    setMismatchError(null)
    await submit(password, passwordConfirmation)
  }

  if (isDone) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="font-serif text-2xl tracking-tight text-ink">Contraseña actualizada</h2>
        <p className="text-muted">Ya puedes iniciar sesión con tu nueva contraseña.</p>
        <Link to="/" className="text-sm font-medium text-brand hover:underline">
          Ir a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="font-serif text-3xl tracking-tight text-ink">Nueva contraseña</h2>
        <p className="text-muted">Elige una contraseña nueva para tu cuenta.</p>
      </div>

      <Form
        className="flex w-full flex-col gap-4"
        render={(props) => <form {...props} onSubmit={handleSubmit} />}
      >
        <TextField isRequired minLength={8} name="password" type="password">
          <Label>Contraseña nueva</Label>
          <Input placeholder="Mínimo 8 caracteres" />
          <FieldError>{state.error?.fieldErrors.password}</FieldError>
        </TextField>

        <TextField isRequired minLength={8} name="password_confirmation" type="password">
          <Label>Confirmar contraseña</Label>
          <Input placeholder="Repite tu contraseña" />
          <FieldError>{mismatchError}</FieldError>
        </TextField>

        {state.error && !state.error.fieldErrors.password && (
          <p className="text-sm text-danger">{state.error.message}</p>
        )}

        <Button type="submit" className="w-full" isDisabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Restablecer contraseña'}
        </Button>
      </Form>
    </div>
  )
}
