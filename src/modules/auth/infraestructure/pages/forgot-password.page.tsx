import { type JSX } from 'react'
import { GuestAuthLayout } from '../components/guest-auth-layout.component'
import { ForgotPasswordForm } from '../components/forgot-password-form.component'

export default function ForgotPasswordPage(): JSX.Element {
  return (
    <GuestAuthLayout>
      <ForgotPasswordForm />
    </GuestAuthLayout>
  )
}
