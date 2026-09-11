import { type FormEvent, type JSX } from 'react'
import { Button, FieldError, Form, Input, Label, TextField } from '@heroui/react'
import { Link } from 'react-router'
import { useForgotPassword } from '../../hooks/use-forgot-password.hook'

export function ForgotPasswordForm(): JSX.Element {
  const { state, submit } = useForgotPassword()
  const isSubmitting = state.status === 'submitting'
  const isDone = state.status === 'done'
  const emailError = state.error?.fieldErrors.email

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    await submit(email)
  }

  if (isDone) {
    return (
      <div className="space-y-6 text-center">
        <h2 className="font-serif text-2xl tracking-tight text-ink">Revisa tu correo</h2>
        <p className="text-muted">
          Si el correo existe, te enviamos un enlace para restablecer tu contraseña.
        </p>
        <Link to="/" className="text-sm font-medium text-brand hover:underline">
          Volver a iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h2 className="font-serif text-3xl tracking-tight text-ink">Recuperar contraseña</h2>
        <p className="text-muted">
          Ingresa tu correo y te enviaremos un enlace para restablecerla.
        </p>
      </div>

      <Form
        className="flex w-full flex-col gap-4"
        render={(props) => <form {...props} onSubmit={handleSubmit} />}
      >
        <TextField isRequired name="email" type="email">
          <Label>Correo</Label>
          <Input placeholder="tucorreo@ejemplo.com" />
          <FieldError />
        </TextField>

        {/* `FieldError` sólo pinta la validación nativa del campo; el 422 del API se muestra aparte. */}
        {emailError !== undefined && (
          <p className="text-sm text-danger" role="alert">
            {emailError}
          </p>
        )}

        {state.error && emailError === undefined && (
          <p className="text-sm text-danger" role="alert">
            {state.error.message}
          </p>
        )}

        <Button type="submit" className="w-full" isDisabled={isSubmitting}>
          {isSubmitting ? 'Enviando…' : 'Enviar enlace'}
        </Button>

        <Link to="/" className="text-center text-sm text-muted hover:underline">
          Volver a iniciar sesión
        </Link>
      </Form>
    </div>
  )
}
