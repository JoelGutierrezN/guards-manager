import { type InputHTMLAttributes, type JSX, useMemo } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'
import { cn } from '../../utils/cn'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  leadIcon?: IconSvgElement
  trailIcon?: IconSvgElement
  lg?: boolean
  error?: boolean
  helpText?: string
}

export function Input({
  label,
  hint,
  leadIcon,
  trailIcon,
  lg = false,
  error = false,
  helpText,
  disabled,
  className,
  ...rest
}: Props): JSX.Element {
  const wrapClassName = useMemo(
    () =>
      cn(
        'flex items-center gap-2 rounded-full border bg-white px-4 transition-[border-color,box-shadow,background]',
        lg ? 'h-[42px] text-[14px]' : 'h-[44px] text-[13px]',
        error
          ? 'border-danger focus-within:shadow-[0_0_0_3px_var(--color-danger-soft)]'
          : 'border-hairline-strong hover:border-ink-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]',
        disabled && 'cursor-not-allowed bg-cream hover:border-hairline-strong',
      ),
    [lg, error, disabled],
  )

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="flex items-center justify-between text-[12px] font-medium text-ink-2">
          <span>{label}</span>
          {hint && (
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
              {hint}
            </span>
          )}
        </label>
      )}
      <div className={wrapClassName}>
        {leadIcon && (
          <span className="inline-flex shrink-0 text-muted">
            <HugeiconsIcon icon={leadIcon} size={14} strokeWidth={1.8} />
          </span>
        )}
        <input
          className={cn(
            'h-full min-w-0 flex-1 border-none bg-transparent p-0 text-ink outline-none placeholder:text-muted-soft disabled:cursor-not-allowed',
            className,
          )}
          disabled={disabled}
          {...rest}
        />
        {trailIcon && (
          <span className="inline-flex shrink-0 text-muted">
            <HugeiconsIcon icon={trailIcon} size={14} strokeWidth={1.8} />
          </span>
        )}
      </div>
      {helpText && (
        <span className={cn('text-[11px]', error ? 'text-danger' : 'text-muted')}>{helpText}</span>
      )}
    </div>
  )
}
