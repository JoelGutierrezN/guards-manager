import type { ChangeAccountPasswordInput } from '../domain/change-account-password-input.model'
import type {
  AccountPasswordFormErrors,
  AccountPasswordFormState,
} from './account-password-form.model'

const MIN_PASSWORD_LENGTH = 8

export class AccountPasswordFormHelper {
  static initialState(): AccountPasswordFormState {
    return {
      currentPassword: '',
      password: '',
      passwordConfirmation: '',
      touched: false,
      isSaving: false,
      apiErrors: {},
      apiMessage: null,
    }
  }

  static validate(state: AccountPasswordFormState): AccountPasswordFormErrors {
    const errors: AccountPasswordFormErrors = {}
    if (state.currentPassword === '') errors.currentPassword = 'Ingresa tu contraseña actual.'
    if (state.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `La nueva contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`
    }
    if (state.passwordConfirmation !== state.password) {
      errors.passwordConfirmation = 'Las contraseñas no coinciden.'
    }
    return errors
  }

  static hasErrors(errors: AccountPasswordFormErrors): boolean {
    return Object.values(errors).some((message) => message !== undefined)
  }

  static mergeErrors(
    localErrors: AccountPasswordFormErrors,
    apiErrors: AccountPasswordFormErrors,
  ): AccountPasswordFormErrors {
    return { ...apiErrors, ...localErrors }
  }

  static toInput(state: AccountPasswordFormState): ChangeAccountPasswordInput {
    return {
      currentPassword: state.currentPassword,
      password: state.password,
      passwordConfirmation: state.passwordConfirmation,
    }
  }
}
