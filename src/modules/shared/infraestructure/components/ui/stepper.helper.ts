import type { StepperStep, StepperStepState, StepperStepView } from './stepper.model'

export class StepperStepsHelper {
  static buildViews(steps: StepperStep[], currentStepId: string): StepperStepView[] {
    const currentIndex = steps.findIndex((step) => step.id === currentStepId)

    return steps.map((step, index) => ({
      step,
      position: index + 1,
      state: StepperStepsHelper.resolveState(step, index, currentIndex),
      isLast: index === steps.length - 1,
    }))
  }

  static resolveState(step: StepperStep, index: number, currentIndex: number): StepperStepState {
    if (step.state) return step.state
    if (currentIndex < 0) return 'pending'
    if (index < currentIndex) return 'done'
    if (index === currentIndex) return 'current'
    return 'pending'
  }

  static isNavigable(state: StepperStepState): boolean {
    return state === 'done' || state === 'error'
  }
}
