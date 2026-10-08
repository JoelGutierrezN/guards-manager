import { type JSX, useMemo } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'
import type { SelectOption } from './select.model'

interface Props {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  id?: string
  name?: string
  placeholder?: string
  ariaLabel?: string
  disabled?: boolean
  error?: boolean
  className?: string
}

export function Select({
  value,
  onChange,
  options,
  id,
  name,
  placeholder,
  ariaLabel,
  disabled = false,
  error = false,
  className,
}: Props): JSX.Element {
  const wrapClassName = useMemo(
    () =>
      cn(
        'relative flex h-[44px] items-center rounded-full border bg-white transition-[border-color,box-shadow,background]',
        error
          ? 'border-danger focus-within:shadow-[0_0_0_3px_var(--color-danger-soft)]'
          : 'border-hairline-strong hover:border-ink-3 focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)]',
        disabled && 'cursor-not-allowed bg-cream hover:border-hairline-strong',
        className,
      ),
    [error, disabled, className],
  )

  const selectClassName = useMemo(
    () =>
      cn(
        'h-full w-full appearance-none border-none bg-transparent pl-4 pr-9 text-[13px] text-ink outline-none disabled:cursor-not-allowed',
        value === '' && 'text-muted-soft',
      ),
    [value],
  )

  return (
    <div className={wrapClassName}>
      <select
        id={id}
        name={name}
        aria-label={ariaLabel}
        aria-invalid={error || undefined}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={selectClassName}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </select>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={14}
        strokeWidth={1.8}
        className="pointer-events-none absolute right-3.5 text-muted"
      />
    </div>
  )
}
