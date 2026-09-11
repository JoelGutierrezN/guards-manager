import type { User } from '../domain/user.entity'
import type { CreateUserInput, UpdateUserInput } from '../domain/user-input.model'
import type { UserFormErrors, UserFormState } from './user-form.model'

const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 80
const MIN_USERNAME_LENGTH = 3
const MIN_PASSWORD_LENGTH = 8
const PHONE_DIGITS = 10
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class UserFormHelper {
  static initialStateFrom(user: User | null): UserFormState {
    return {
      name: user?.name ?? '',
      email: user?.email ?? '',
      username: user?.username ?? '',
      phone: user?.phone ?? '',
      password: '',
      touched: false,
      apiErrors: {},
    }
  }

  static validate(state: UserFormState, isEdit: boolean): UserFormErrors {
    const errors: UserFormErrors = {}
    const name = state.name.trim()
    const email = state.email.trim()
    const username = state.username.trim()
    const phoneDigits = state.phone.replace(/\D/g, '')

    if (name.length < MIN_NAME_LENGTH) errors.name = 'Escribe al menos 2 caracteres.'
    else if (name.length > MAX_NAME_LENGTH) errors.name = 'Máximo 80 caracteres.'

    if (email === '' || !EMAIL_PATTERN.test(email)) errors.email = 'Correo no válido.'

    if (username.length < MIN_USERNAME_LENGTH) errors.username = 'Usa al menos 3 caracteres.'

    if (state.phone.trim() !== '' && phoneDigits.length !== PHONE_DIGITS) {
      errors.phone = 'Usa 10 dígitos.'
    }

    const passwordProvided = state.password !== ''
    if (!isEdit && !passwordProvided) errors.password = 'La contraseña es obligatoria.'
    else if (passwordProvided && state.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = 'Usa al menos 8 caracteres.'
    }

    return errors
  }

  static hasErrors(errors: UserFormErrors): boolean {
    return Object.values(errors).some((message) => message !== undefined)
  }

  /** Los errores locales tienen prioridad sobre los del 422 porque describen el valor actual. */
  static mergeErrors(localErrors: UserFormErrors, apiErrors: UserFormErrors): UserFormErrors {
    return { ...apiErrors, ...localErrors }
  }

  static toCreateInput(state: UserFormState): CreateUserInput {
    const phone = state.phone.replace(/\D/g, '')
    return {
      name: state.name.trim(),
      email: state.email.trim(),
      username: state.username.trim(),
      phone: phone === '' ? null : phone,
      password: state.password,
    }
  }

  static toUpdateInput(state: UserFormState): UpdateUserInput {
    const phone = state.phone.replace(/\D/g, '')
    return {
      name: state.name.trim(),
      email: state.email.trim(),
      username: state.username.trim(),
      phone: phone === '' ? null : phone,
      password: state.password === '' ? null : state.password,
    }
  }
}
