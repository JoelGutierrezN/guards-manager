import { type JSX } from 'react'
import { useSearchParams } from 'react-router'
import { GuestAuthLayout } from '../components/guest-auth-layout.component'
import { ResetPasswordForm } from '../components/reset-password-form.component'
import { ResetPasswordInvalidLink } from '../components/reset-password-invalid-link.component'
import { ResetPasswordLinkHelper } from '../helpers/reset-password-link.helper'

export default function ResetPasswordPage(): JSX.Element {
  const [searchParams] = useSearchParams()
  const linkParams = ResetPasswordLinkHelper.fromSearchParams(searchParams)

  return (
    <GuestAuthLayout>
      {linkParams === null ? (
        <ResetPasswordInvalidLink />
      ) : (
        <ResetPasswordForm linkParams={linkParams} />
      )}
    </GuestAuthLayout>
  )
}
