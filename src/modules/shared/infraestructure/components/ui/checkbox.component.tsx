import {
  type ChangeEventHandler,
  type InputHTMLAttributes,
  type JSX,
  useEffect,
  useRef,
} from 'react'
import { cn } from '../../utils/cn'

interface Props extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'checked' | 'type'
> {
  checked?: boolean
  indeterminate?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  label?: string
}

export function Checkbox({ checked, indeterminate, onChange, label, ...rest }: Props): JSX.Element {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = !!indeterminate
    }
  }, [indeterminate])

  return (
    <label
      className={cn(
        'relative inline-flex cursor-pointer select-none items-center gap-2 text-[13px]',
        rest.disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <input
        ref={inputRef}
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        readOnly={!onChange}
        className="absolute h-0 w-0 opacity-0"
        {...rest}
      />
      <span
        className={cn(
          'inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[8px] border-[1.5px] transition-[background,border-color,box-shadow]',
          checked || indeterminate
            ? 'border-brand bg-brand'
            : 'border-hairline-strong bg-white hover:border-ink-3',
        )}
      >
        {checked && !indeterminate && (
          <svg
            width="8"
            height="6"
            viewBox="0 0 8 6"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 3L3 5L7 1"
              stroke="var(--color-cream)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
        {indeterminate && <span className="block h-[1.5px] w-2 rounded-full bg-cream" />}
      </span>
      {label && <span>{label}</span>}
    </label>
  )
}
