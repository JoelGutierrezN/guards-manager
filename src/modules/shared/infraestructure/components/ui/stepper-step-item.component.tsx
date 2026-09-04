import { type JSX, memo, useCallback, useMemo } from 'react'
import { Alert02Icon, Tick02Icon } from '@hugeicons/core-free-icons'
import { cn } from '../../utils/cn'
import { Icon } from './icon.component'
import { StepperStepsHelper } from './stepper.helper'
import type { StepperStepState, StepperStepView } from './stepper.model'

interface Props {
  view: StepperStepView
  onSelect?: (stepId: string) => void
}

const MARKERS: Record<StepperStepState, string> = {
  pending: 'border-hairline-strong bg-white text-muted',
  current: 'border-brand bg-brand text-cream shadow-[0_4px_10px_-4px_rgba(39,40,113,0.6)]',
  done: 'border-ok bg-ok-soft text-ok',
  error: 'border-danger bg-danger-soft text-danger',
}

const LABELS: Record<StepperStepState, string> = {
  pending: 'text-muted',
  current: 'text-ink',
  done: 'text-ink-2',
  error: 'text-danger',
}

const CONNECTORS: Record<StepperStepState, string> = {
  pending: 'bg-hairline-strong',
  current: 'bg-hairline-strong',
  done: 'bg-ok',
  error: 'bg-danger',
}

function StepperStepItemInner({ view, onSelect }: Props): JSX.Element {
  const isInteractive = Boolean(onSelect) && StepperStepsHelper.isNavigable(view.state)

  const triggerClassName = useMemo(
    () =>
      cn(
        'inline-flex items-center gap-2.5 rounded-full text-left transition-[opacity] disabled:cursor-default',
        isInteractive && 'cursor-pointer hover:opacity-80',
      ),
    [isInteractive],
  )

  const markerClassName = useMemo(
    () =>
      cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[12px] font-semibold tabular-nums transition-[background,border-color,color]',
        MARKERS[view.state],
      ),
    [view.state],
  )

  const labelClassName = useMemo(
    () => cn('text-[13px] font-semibold tracking-[-0.005em]', LABELS[view.state]),
    [view.state],
  )

  const connectorClassName = useMemo(
    () => cn('mx-3 h-px min-w-6 flex-1 rounded-full', CONNECTORS[view.state]),
    [view.state],
  )

  const handleSelect = useCallback(() => {
    if (!onSelect) return
    onSelect(view.step.id)
  }, [onSelect, view.step.id])

  return (
    <li className={cn('flex items-center', view.isLast ? 'shrink-0' : 'min-w-0 flex-1')}>
      <button
        type="button"
        className={triggerClassName}
        disabled={!isInteractive}
        onClick={handleSelect}
        aria-current={view.state === 'current' ? 'step' : undefined}
      >
        <span className={markerClassName}>
          {view.state === 'done' && <Icon icon={Tick02Icon} size={14} />}
          {view.state === 'error' && <Icon icon={Alert02Icon} size={14} />}
          {view.state !== 'done' && view.state !== 'error' && view.position}
        </span>
        <span className="min-w-0">
          <span className={labelClassName}>{view.step.label}</span>
          {view.step.hint && (
            <span className="block text-[11px] leading-tight text-muted">{view.step.hint}</span>
          )}
        </span>
      </button>
      {!view.isLast && <span className={connectorClassName} />}
    </li>
  )
}

export const StepperStepItem = memo(StepperStepItemInner)
