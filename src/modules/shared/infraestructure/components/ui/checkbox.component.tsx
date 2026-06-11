import { type InputHTMLAttributes, type JSX } from 'react'
import { cn } from '../../utils/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Etiqueta opcional a la derecha de la casilla. */
  label?: string
}

/** Casilla de verificación con caja personalizada. Fiel al `.cb` del diseño. */
export function Checkbox({ label, className, ...rest }: CheckboxProps): JSX.Element {
  return (
    <label className={cn('group relative inline-flex cursor-pointer items-center gap-2 text-[13px] select-none', className)}>
      <input type="checkbox" className="peer absolute h-0 w-0 opacity-0" {...rest} />
      <span className="grid h-4 w-4 shrink-0 place-items-center rounded-[5px] border-[1.5px] border-hairline-strong bg-white transition-[background,border-color] duration-[120ms] group-hover:border-ink-3 peer-checked:border-brand peer-checked:bg-brand peer-focus-visible:shadow-[0_0_0_3px_var(--color-brand-soft-2)]">
        <svg viewBox="0 0 10 8" fill="none" className="h-2 w-2.5 opacity-0 transition-opacity peer-checked:opacity-100">
          <path
            d="M1 4.2 3.4 6.6 9 1"
            stroke="var(--color-cream)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label && <span className="text-ink-2">{label}</span>}
    </label>
  )
}
