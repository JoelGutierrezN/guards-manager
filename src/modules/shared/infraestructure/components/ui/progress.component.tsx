import { type JSX, useMemo } from 'react'
import { cn } from '../../utils/cn'
import type { ProgressTone } from './progress.model'

interface Props {
  value: number
  tone?: ProgressTone
  indeterminate?: boolean
  label?: string
}

const TONE_CLASS_NAMES: Record<ProgressTone, string> = {
  brand: 'bg-brand',
  ok: 'bg-ok',
  danger: 'bg-danger',
}

export function Progress({
  value,
  tone = 'brand',
  indeterminate = false,
  label,
}: Props): JSX.Element {
  const clampedValue = useMemo(() => Math.min(100, Math.max(0, value)), [value])

  const fillClassName = useMemo(
    () =>
      cn(
        'h-full rounded-full transition-[width] duration-300',
        TONE_CLASS_NAMES[tone],
        indeterminate && 'w-2/5 animate-pulse',
      ),
    [tone, indeterminate],
  )

  const fillStyle = useMemo(
    () => (indeterminate ? undefined : { width: `${clampedValue}%` }),
    [indeterminate, clampedValue],
  )

  return (
    <div className="w-full">
      {label && <div className="mb-1.5 text-[12px] font-medium text-ink-2">{label}</div>}
      <div
        role="progressbar"
        aria-valuenow={indeterminate ? undefined : clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-cream-2"
      >
        <div className={fillClassName} style={fillStyle} />
      </div>
    </div>
  )
}
