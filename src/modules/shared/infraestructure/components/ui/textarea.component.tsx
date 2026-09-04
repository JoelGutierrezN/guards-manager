import { type JSX, type TextareaHTMLAttributes, useMemo } from 'react'
import { cn } from '../../utils/cn'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({
  error = false,
  rows = 3,
  disabled,
  className,
  ...rest
}: Props): JSX.Element {
  const textareaClassName = useMemo(
    () =>
      cn(
        'w-full resize-y rounded-[16px] border bg-white px-4 py-3 text-[13px] leading-relaxed text-ink outline-none transition-[border-color,box-shadow,background] placeholder:text-muted-soft',
        error
          ? 'border-danger focus:shadow-[0_0_0_3px_var(--color-danger-soft)]'
          : 'border-hairline-strong hover:border-ink-3 focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)]',
        disabled && 'cursor-not-allowed resize-none bg-cream hover:border-hairline-strong',
        className,
      ),
    [error, disabled, className],
  )

  return (
    <textarea
      rows={rows}
      disabled={disabled}
      aria-invalid={error || undefined}
      className={textareaClassName}
      {...rest}
    />
  )
}
