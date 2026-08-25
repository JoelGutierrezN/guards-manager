import type { Employee } from '../domain/employee.entity'
import type { CreateEmployeeInput } from '../domain/employee-input.model'
import type { EmployeeFormErrors, EmployeeFormState } from './employee-form.model'

const MIN_NAME_LENGTH = 2
const MAX_NAME_LENGTH = 80
const PHONE_DIGITS = 10
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export class EmployeeFormHelper {
  static initialStateFrom(employee: Employee | null): EmployeeFormState {
    return {
      name: employee?.name ?? '',
      roleId: employee?.roleId ?? '',
      email: employee?.email ?? '',
      phone: employee?.phone ?? '',
      roles: [],
      rolesStatus: 'idle',
      touched: false,
    }
  }

  static validate(state: EmployeeFormState): EmployeeFormErrors {
    const errors: EmployeeFormErrors = {}
    const name = state.name.trim()
    const email = state.email.trim()
    const phoneDigits = state.phone.replace(/\D/g, '')

    if (name.length < MIN_NAME_LENGTH) errors.name = 'Escribe al menos 2 caracteres.'
    else if (name.length > MAX_NAME_LENGTH) errors.name = 'Máximo 80 caracteres.'

    if (state.roleId === '') errors.roleId = 'Selecciona un rol.'

    if (email !== '' && !EMAIL_PATTERN.test(email)) errors.email = 'Correo no válido.'

    if (state.phone.trim() !== '' && phoneDigits.length !== PHONE_DIGITS) {
      errors.phone = 'Usa 10 dígitos.'
    }

    return errors
  }

  static hasErrors(errors: EmployeeFormErrors): boolean {
    return Object.keys(errors).length > 0
  }

  static toInput(state: EmployeeFormState): CreateEmployeeInput {
    const email = state.email.trim()
    const phone = state.phone.replace(/\D/g, '')
    return {
      name: state.name.trim(),
      roleId: state.roleId,
      email: email === '' ? null : email,
      phone: phone === '' ? null : phone,
    }
  }
}
