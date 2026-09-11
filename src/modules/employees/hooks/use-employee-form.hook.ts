import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { Employee } from '../domain/employee.entity'
import type { CreateEmployeeInput } from '../domain/employee-input.model'
import type { EmployeeStatus } from '../domain/employee-status.model'
import type { EmployeeFormErrors } from '../application/employee-form.model'
import { employeeFormReducer } from '../application/employee-form.reducer'
import { EmployeeFormHelper } from '../application/employee-form.helper'
import { rolesRepository } from '../infraestructure/repositories/roles.repository'
import { ApiValidationErrorHelper } from '../../shared/infraestructure/errors/api-validation-error.helper'

const ROLE_CREATE_GENERIC_MESSAGE = 'No se pudo crear el puesto.'

interface UseEmployeeFormOptions {
  enabled: boolean
  editEmployee: Employee | null
  onSave: (input: CreateEmployeeInput) => void
}

export function useEmployeeForm({ enabled, editEmployee, onSave }: UseEmployeeFormOptions) {
  const [state, dispatch] = useReducer(
    employeeFormReducer,
    editEmployee,
    EmployeeFormHelper.initialStateFrom,
  )
  const rolesSequenceRef = useRef(0)

  useEffect(() => {
    if (!enabled || state.rolesStatus !== 'idle') return
    const sequence = ++rolesSequenceRef.current
    dispatch({ type: 'ROLES_START' })
    rolesRepository
      .select()
      .then((roles) => {
        if (sequence === rolesSequenceRef.current) dispatch({ type: 'ROLES_SUCCESS', roles })
      })
      .catch(() => {
        if (sequence === rolesSequenceRef.current) dispatch({ type: 'ROLES_ERROR' })
      })
  }, [enabled, state.rolesStatus])

  const errors = useMemo(() => EmployeeFormHelper.validate(state), [state])

  const visibleErrors = useMemo<EmployeeFormErrors>(
    () => (state.touched ? errors : {}),
    [state.touched, errors],
  )

  const canSave = useMemo(
    () =>
      !EmployeeFormHelper.hasErrors(errors) && state.rolesStatus === 'ready' && !state.roleCreating,
    [errors, state.rolesStatus, state.roleCreating],
  )

  const setName = useCallback((name: string) => dispatch({ type: 'SET_NAME', name }), [])
  const setRole = useCallback((roleId: string) => dispatch({ type: 'SET_ROLE', roleId }), [])
  const setEmail = useCallback((email: string) => dispatch({ type: 'SET_EMAIL', email }), [])
  const setPhone = useCallback((phone: string) => dispatch({ type: 'SET_PHONE', phone }), [])
  const setHiredAt = useCallback(
    (hiredAt: string) => dispatch({ type: 'SET_HIRED_AT', hiredAt }),
    [],
  )
  const setStatus = useCallback(
    (status: EmployeeStatus) => dispatch({ type: 'SET_STATUS', status }),
    [],
  )

  const createRole = useCallback(async (name: string) => {
    const trimmedName = name.trim()
    if (trimmedName === '') return
    dispatch({ type: 'ROLE_CREATE_START' })
    try {
      const role = await rolesRepository.create(trimmedName)
      dispatch({ type: 'ROLE_CREATE_SUCCESS', role })
    } catch (error) {
      const message = ApiValidationErrorHelper.messageFrom(error, ROLE_CREATE_GENERIC_MESSAGE)
      dispatch({ type: 'ROLE_CREATE_ERROR', message })
    }
  }, [])

  const submit = useCallback(() => {
    dispatch({ type: 'TOUCH' })
    if (!canSave) return
    onSave(EmployeeFormHelper.toInput(state))
  }, [canSave, state, onSave])

  return {
    state,
    visibleErrors,
    canSave,
    setName,
    setRole,
    setEmail,
    setPhone,
    setHiredAt,
    setStatus,
    createRole,
    submit,
  }
}
