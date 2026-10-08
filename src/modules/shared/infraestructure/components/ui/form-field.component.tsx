import { type JSX, type ReactNode, useMemo } from 'react'
import { cn } from '../../utils/cn'

interface Props {
  label?: string
  htmlFor?: string
  hint?: string
  helpText?: string
  error?: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function FormField({
  label,
  htmlFor,
  hint,
  helpText,
  error,
  required = false,
  className,
  children,
}: Props): JSX.Element {
  const message = error ?? helpText
  const messageClassName = useMemo(
    () => cn('text-[11px]', error ? 'text-danger' : 'text-muted'),
    [error],
  )

  return (
    <div className={cn('flex w-full flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="flex items-center justify-between text-[12px] font-medium text-ink-2"
        >
          <span>
            {label}
            {required && (
              <span className="ml-0.5 text-danger" aria-hidden="true">
                *
              </span>
            )}
          </span>
          {hint && (
            <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
              {hint}
            </span>
          )}
        </label>
      )}
      {children}
      {message && (
        <span className={messageClassName} role={error ? 'alert' : undefined}>
          {message}
        </span>
      )}
    </div>
  )
}
