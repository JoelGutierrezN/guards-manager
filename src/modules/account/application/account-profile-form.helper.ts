import type { AccountProfile } from '../domain/account-profile.model'
import type { UpdateAccountProfileInput } from '../domain/update-account-profile-input.model'
import type {
  AccountProfileFormErrors,
  AccountProfileFormState,
} from './account-profile-form.model'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class AccountProfileFormHelper {
  static initialStateFrom(profile: AccountProfile | null): AccountProfileFormState {
    return {
      name: profile?.name ?? '',
      email: profile?.email ?? '',
      username: profile?.username ?? '',
      phone: profile?.phone ?? '',
      touched: false,
      isSaving: false,
      apiErrors: {},
      apiMessage: null,
    }
  }

  static validate(state: AccountProfileFormState): AccountProfileFormErrors {
    const errors: AccountProfileFormErrors = {}
    if (state.name.trim() === '') errors.name = 'El nombre es obligatorio.'
    if (state.username.trim() === '') errors.username = 'El usuario es obligatorio.'
    if (state.email.trim() === '') {
      errors.email = 'El correo es obligatorio.'
    } else if (!EMAIL_PATTERN.test(state.email.trim())) {
      errors.email = 'El correo no es válido.'
    }
    return errors
  }

  static hasErrors(errors: AccountProfileFormErrors): boolean {
    return Object.values(errors).some((message) => message !== undefined)
  }

  static mergeErrors(
    localErrors: AccountProfileFormErrors,
    apiErrors: AccountProfileFormErrors,
  ): AccountProfileFormErrors {
    return { ...apiErrors, ...localErrors }
  }

  static toInput(state: AccountProfileFormState): UpdateAccountProfileInput {
    const trimmedPhone = state.phone.trim()
    return {
      name: state.name.trim(),
      email: state.email.trim(),
      username: state.username.trim(),
      phone: trimmedPhone === '' ? null : trimmedPhone,
    }
  }
}
