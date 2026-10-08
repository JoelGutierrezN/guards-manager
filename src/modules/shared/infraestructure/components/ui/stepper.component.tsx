import { type JSX, useMemo } from 'react'
import { cn } from '../../utils/cn'
import { StepperStepItem } from './stepper-step-item.component'
import { StepperStepsHelper } from './stepper.helper'
import type { StepperStep } from './stepper.model'

interface Props {
  steps: StepperStep[]
  currentStepId: string
  onSelect?: (stepId: string) => void
  className?: string
}

export function Stepper({ steps, currentStepId, onSelect, className }: Props): JSX.Element {
  const views = useMemo(
    () => StepperStepsHelper.buildViews(steps, currentStepId),
    [steps, currentStepId],
  )

  return (
    <ol className={cn('flex w-full flex-wrap items-center gap-y-2', className)}>
      {views.map((view) => (
        <StepperStepItem key={view.step.id} view={view} onSelect={onSelect} />
      ))}
    </ol>
  )
}
