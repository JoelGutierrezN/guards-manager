export type StepperStepState = 'pending' | 'current' | 'done' | 'error'

export interface StepperStep {
  id: string
  label: string
  hint?: string
  state?: StepperStepState
}

export interface StepperStepView {
  step: StepperStep
  position: number
  state: StepperStepState
  isLast: boolean
}
