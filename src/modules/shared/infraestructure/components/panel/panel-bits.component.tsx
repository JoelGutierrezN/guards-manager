import { type JSX, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface WithClass {
  className?: string
  children: ReactNode
}

export function Eyebrow({ className, children }: WithClass): JSX.Element {
  return (
    <div
      className={cn(
        'font-mono text-[10px] font-medium tracking-[0.22em] text-muted uppercase',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function BentoTitle({ className, children }: WithClass): JSX.Element {
  return (
    <h3
      className={cn(
        'm-0 text-[22px] leading-[1.15] font-medium tracking-[-0.025em] text-ink',
        className,
      )}
    >
      {children}
    </h3>
  )
}

export function BentoPill({ className, children }: WithClass): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex h-[22px] w-max items-center gap-[5px] rounded-full border border-hairline-strong bg-white px-[9px] font-mono text-[11px] font-medium tracking-[0.04em] whitespace-nowrap text-ink-2',
        className,
      )}
    >
      {children}
    </span>
  )
}
