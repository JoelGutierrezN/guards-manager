import { type ChangeEvent, type JSX, useMemo, useState } from 'react'
import { MinusSignIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import { NumberInputHelper } from './number-input.helper'

interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  id?: string
  name?: string
  ariaLabel?: string
  suffix?: string
  disabled?: boolean
  error?: boolean
  className?: string
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  id,
  name,
  ariaLabel,
  suffix,
  disabled = false,
  error = false,
  className,
}: Props): JSX.Element {
  const [draftText, setDraftText] = useState<string | null>(null)

  const wrapClassName = useMemo(
    () =>
      cn(
        'inline-flex h-[44px] w-full items-center gap-1 rounded-full border bg-white px-1.5 transition-[border-color,box-shadow,background]',
        error
          ? 'border-danger focus-within:shadow-[0_0_0_3px_var(--color-danger-soft)]'
          : 'border-hairline-strong hover:border-ink-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]',
        disabled && 'cursor-not-allowed bg-cream hover:border-hairline-strong',
        className,
      ),
    [error, disabled, className],
  )

  const stepperClassName =
    'inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-cream-2 hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'

  const canDecrease = !disabled && value > min
  const canIncrease = !disabled && value < max

  const applyStep = (direction: number) => {
    setDraftText(null)
    onChange(NumberInputHelper.clamp(value + step * direction, min, max))
  }

  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const rawText = event.target.value
    setDraftText(rawText)
    const parsed = NumberInputHelper.parse(rawText)
    if (parsed !== null) onChange(parsed)
  }

  const handleBlur = () => {
    const parsed = NumberInputHelper.parse(draftText ?? String(value))
    setDraftText(null)
    onChange(NumberInputHelper.clamp(parsed ?? min, min, max))
  }

  return (
    <div className={wrapClassName}>
      <button
        type="button"
        aria-label="Disminuir"
        className={stepperClassName}
        disabled={!canDecrease}
        onClick={() => applyStep(-1)}
      >
        <HugeiconsIcon icon={MinusSignIcon} size={14} strokeWidth={2} />
      </button>
      <input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        value={draftText ?? String(value)}
        disabled={disabled}
        onChange={handleTextChange}
        onBlur={handleBlur}
        className="h-full min-w-0 flex-1 border-none bg-transparent text-center text-[14px] font-semibold text-ink outline-none disabled:cursor-not-allowed"
      />
      {suffix && <span className="shrink-0 pr-1 text-[12px] text-muted">{suffix}</span>}
      <button
        type="button"
        aria-label="Aumentar"
        className={stepperClassName}
        disabled={!canIncrease}
        onClick={() => applyStep(1)}
      >
        <HugeiconsIcon icon={PlusSignIcon} size={14} strokeWidth={2} />
      </button>
    </div>
  )
}
