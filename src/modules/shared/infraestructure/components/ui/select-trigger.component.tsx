import { type ButtonHTMLAttributes, type JSX } from 'react'
import { ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../utils/cn'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string
  value: string
}

export function SelectTrigger({ label, value, className, ...rest }: Props): JSX.Element {
  return (
    <button
      type="button"
      className={cn(
        'inline-flex h-8 items-center gap-2 rounded-[14px] border border-hairline-strong bg-white px-3 pl-3 pr-2 text-[12px] font-medium text-ink transition-[border-color,background] hover:border-ink-3',
        className,
      )}
      {...rest}
    >
      {label && <span className="mr-0.5 text-muted">{label}</span>}
      <span>{value}</span>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        size={14}
        strokeWidth={1.8}
        className="ml-0.5 text-muted"
      />
    </button>
  )
}
