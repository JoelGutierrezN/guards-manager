import type { ResetPasswordLinkParams } from '../../domain/reset-password-link.model'

export class ResetPasswordLinkHelper {
  static fromSearchParams(searchParams: URLSearchParams): ResetPasswordLinkParams | null {
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    const expires = searchParams.get('expires')
    const signature = searchParams.get('signature')

    if (token === null || email === null || expires === null || signature === null) {
      return null
    }

    return { token, email, expires, signature }
  }
}
