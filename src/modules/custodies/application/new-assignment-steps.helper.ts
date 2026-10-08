import type { StepperStep } from '../../shared/infraestructure/components/ui'
import {
  NEW_ASSIGNMENT_STEP_IDS,
  type NewAssignmentState,
  type NewAssignmentStepId,
} from './new-assignment-state.model'

const STEP_LABELS: Record<NewAssignmentStepId, string> = {
  employee: 'Empleado',
  units: 'Unidades',
  confirm: 'Confirmación',
}

/** Reglas de avance del wizard: qué paso está completo, cuál sigue y cuál se puede abrir. */
export class NewAssignmentStepsHelper {
  static buildSteps(state: NewAssignmentState): StepperStep[] {
    return NEW_ASSIGNMENT_STEP_IDS.map((stepId) => ({
      id: stepId,
      label: STEP_LABELS[stepId],
      hint: NewAssignmentStepsHelper.hintOf(state, stepId),
      state: NewAssignmentStepsHelper.hasError(state, stepId) ? 'error' : undefined,
    }))
  }

  static isCompleted(state: NewAssignmentState, stepId: NewAssignmentStepId): boolean {
    if (stepId === 'employee') return state.employee !== null
    if (stepId === 'units') return state.cart.length > 0
    return state.employee !== null && state.cart.length > 0
  }

  static isReachable(state: NewAssignmentState, stepId: NewAssignmentStepId): boolean {
    if (stepId === 'employee') return true
    if (stepId === 'units') return NewAssignmentStepsHelper.isCompleted(state, 'employee')
    return (
      NewAssignmentStepsHelper.isCompleted(state, 'employee') &&
      NewAssignmentStepsHelper.isCompleted(state, 'units')
    )
  }

  static next(stepId: NewAssignmentStepId): NewAssignmentStepId | null {
    return NewAssignmentStepsHelper.neighbour(stepId, 1)
  }

  static previous(stepId: NewAssignmentStepId): NewAssignmentStepId | null {
    return NewAssignmentStepsHelper.neighbour(stepId, -1)
  }

  static isStepId(candidate: string): candidate is NewAssignmentStepId {
    return NEW_ASSIGNMENT_STEP_IDS.some((stepId) => stepId === candidate)
  }

  private static neighbour(
    stepId: NewAssignmentStepId,
    offset: number,
  ): NewAssignmentStepId | null {
    const position = NEW_ASSIGNMENT_STEP_IDS.indexOf(stepId)
    return NEW_ASSIGNMENT_STEP_IDS[position + offset] ?? null
  }

  private static hintOf(state: NewAssignmentState, stepId: NewAssignmentStepId): string {
    if (stepId === 'employee') {
      return state.employee === null ? 'Sin elegir' : state.employee.name
    }
    if (stepId === 'units') {
      return state.cart.length === 1 ? '1 unidad' : `${state.cart.length} unidades`
    }
    return 'Condición y notas'
  }

  private static hasError(state: NewAssignmentState, stepId: NewAssignmentStepId): boolean {
    if (state.error === null) return false
    if (stepId === 'employee') return state.error.fieldErrors.employee !== undefined
    if (stepId === 'units') return false
    return (
      Object.keys(state.error.itemErrors).length > 0 ||
      state.error.fieldErrors.items !== undefined ||
      state.error.fieldErrors.notes !== undefined
    )
  }
}
