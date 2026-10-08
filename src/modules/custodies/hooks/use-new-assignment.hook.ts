import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ItemCondition } from '../../shared/domain/item-condition.model'
import type { ComboboxItem, StepperStep } from '../../shared/infraestructure/components/ui'
import { useQueryParams } from '../../shared/hooks/use-query-params.hook'
import { NewAssignmentCartHelper } from '../application/new-assignment-cart.helper'
import { NewAssignmentStepsHelper } from '../application/new-assignment-steps.helper'
import {
  INITIAL_NEW_ASSIGNMENT_STATE,
  type NewAssignmentState,
  type NewAssignmentStepId,
} from '../application/new-assignment-state.model'
import { newAssignmentReducer } from '../application/new-assignment.reducer'
import type { CustodyDetail } from '../domain/custody.entity'
import type { EmployeeOption } from '../domain/employee-option.model'
import type { AvailableStock } from '../domain/new-assignment-option.model'
import { EmployeeOptionHelper } from '../infraestructure/helpers/employee-option.helper'
import { NewAssignmentErrorHelper } from '../infraestructure/helpers/new-assignment-error.helper'
import { NewAssignmentNavigationHelper } from '../infraestructure/helpers/new-assignment-navigation.helper'
import { newAssignmentRepository } from '../infraestructure/repositories/new-assignment.repository'
import { custodiesRepository } from '../infraestructure/repositories/custodies.repository'

interface NewAssignmentResult {
  state: NewAssignmentState
  steps: StepperStep[]
  canContinue: boolean
  canSubmit: boolean
  loadEmployeeOptions: (query: string) => Promise<ComboboxItem[]>
  selectEmployee: (item: ComboboxItem | null) => void
  goToStep: (stepId: string) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  addUnits: (stocks: AvailableStock[]) => void
  removeUnit: (stockId: string) => void
  clearCart: () => void
  setItemCondition: (stockId: string, condition: ItemCondition) => void
  setItemNotes: (stockId: string, notes: string) => void
  setNotes: (notes: string) => void
  restart: () => void
  submit: () => Promise<CustodyDetail | null>
}

export function useNewAssignment(): NewAssignmentResult {
  const { params } = useQueryParams()
  const initialEmployeeId = NewAssignmentNavigationHelper.employeeIdFrom(params)
  const [state, dispatch] = useReducer(newAssignmentReducer, INITIAL_NEW_ASSIGNMENT_STATE)
  const employeesCache = useRef(new Map<string, EmployeeOption>())

  useEffect(() => {
    if (initialEmployeeId === null) return

    let isActive = true
    dispatch({ type: 'EMPLOYEE_LOAD_START' })
    newAssignmentRepository
      .getEmployee(initialEmployeeId)
      .then((employee) => {
        if (isActive) dispatch({ type: 'EMPLOYEE_LOAD_SUCCESS', payload: employee })
      })
      .catch((error: unknown) => {
        if (isActive) {
          dispatch({
            type: 'EMPLOYEE_LOAD_ERROR',
            payload: NewAssignmentErrorHelper.employeeLoadReport(error),
          })
        }
      })

    return () => {
      isActive = false
    }
  }, [initialEmployeeId])

  const loadEmployeeOptions = useCallback(async (query: string): Promise<ComboboxItem[]> => {
    const employees = await newAssignmentRepository.searchActiveEmployees(query)
    employees.forEach((employee) => employeesCache.current.set(employee.id, employee))
    return employees.map((employee) => EmployeeOptionHelper.toComboboxItem(employee))
  }, [])

  const selectEmployee = useCallback((item: ComboboxItem | null) => {
    const employee = item === null ? null : (employeesCache.current.get(item.value) ?? null)
    dispatch({ type: 'EMPLOYEE_SELECTED', payload: employee })
  }, [])

  const goToStep = useCallback(
    (stepId: string) => {
      if (!NewAssignmentStepsHelper.isStepId(stepId)) return
      if (!NewAssignmentStepsHelper.isReachable(state, stepId)) return
      dispatch({ type: 'STEP_SELECTED', payload: stepId })
    },
    [state],
  )

  const moveTo = useCallback((stepId: NewAssignmentStepId | null) => {
    if (stepId === null) return
    dispatch({ type: 'STEP_SELECTED', payload: stepId })
  }, [])

  const goToNextStep = useCallback(() => {
    moveTo(NewAssignmentStepsHelper.next(state.stepId))
  }, [moveTo, state.stepId])

  const goToPreviousStep = useCallback(() => {
    moveTo(NewAssignmentStepsHelper.previous(state.stepId))
  }, [moveTo, state.stepId])

  const addUnits = useCallback((stocks: AvailableStock[]) => {
    dispatch({ type: 'UNITS_ADDED', payload: stocks })
  }, [])

  const removeUnit = useCallback((stockId: string) => {
    dispatch({ type: 'UNIT_REMOVED', payload: stockId })
  }, [])

  const clearCart = useCallback(() => dispatch({ type: 'CART_CLEARED' }), [])

  const setItemCondition = useCallback((stockId: string, condition: ItemCondition) => {
    dispatch({ type: 'ITEM_CONDITION_CHANGED', payload: { stockId, condition } })
  }, [])

  const setItemNotes = useCallback((stockId: string, notes: string) => {
    dispatch({ type: 'ITEM_NOTES_CHANGED', payload: { stockId, notes } })
  }, [])

  const setNotes = useCallback((notes: string) => {
    dispatch({ type: 'NOTES_CHANGED', payload: notes })
  }, [])

  const restart = useCallback(() => dispatch({ type: 'ASSIGNMENT_RESTARTED' }), [])

  const { employee, cart, notes, status } = state

  const submit = useCallback(async (): Promise<CustodyDetail | null> => {
    if (employee === null || cart.length === 0 || status !== 'editing') return null

    const stockIds = NewAssignmentCartHelper.stockIds(cart)
    dispatch({ type: 'SUBMIT_START' })
    try {
      const custody = await custodiesRepository.create({
        employeeId: employee.id,
        notes: notes.trim() === '' ? null : notes.trim(),
        items: NewAssignmentCartHelper.toInputItems(cart),
      })
      dispatch({ type: 'SUBMIT_SUCCESS', payload: custody })
      return custody
    } catch (error: unknown) {
      dispatch({
        type: 'SUBMIT_ERROR',
        payload: NewAssignmentErrorHelper.reportFrom(error, stockIds),
      })
      return null
    }
  }, [employee, cart, notes, status])

  const steps = useMemo(() => NewAssignmentStepsHelper.buildSteps(state), [state])

  const canContinue = useMemo(
    () => NewAssignmentStepsHelper.isCompleted(state, state.stepId),
    [state],
  )

  const canSubmit = useMemo(
    () => status === 'editing' && employee !== null && cart.length > 0,
    [status, employee, cart.length],
  )

  return {
    state,
    steps,
    canContinue,
    canSubmit,
    loadEmployeeOptions,
    selectEmployee,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    addUnits,
    removeUnit,
    clearCart,
    setItemCondition,
    setItemNotes,
    setNotes,
    restart,
    submit,
  }
}
