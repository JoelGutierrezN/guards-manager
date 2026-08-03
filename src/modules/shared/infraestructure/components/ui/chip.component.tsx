import { type JSX, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

export type ChipTone = 'default' | 'navy' | 'ok' | 'warn' | 'danger'

interface ChipProps {
  tone?: ChipTone
  size?: 'sm' | 'md'
  dot?: boolean
  children: ReactNode
}

const TONES: Record<ChipTone, string> = {
  default: 'bg-white border-hairline-strong text-ink-2',
  navy: 'bg-brand-soft border-brand-soft-2 text-brand',
  ok: 'bg-ok-soft border-transparent text-ok',
  warn: 'bg-warn-soft border-transparent text-warn',
  danger: 'bg-danger-soft border-transparent text-danger',
}

export function Chip({ tone = 'default', size = 'md', dot, children }: ChipProps): JSX.Element {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border leading-none font-semibold tracking-[0.02em] whitespace-nowrap',
        size === 'sm' ? 'h-[18px] px-1.5 text-[10px]' : 'h-[22px] px-2 text-[11px]',
        TONES[tone],
      )}
    >
      {dot && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />}
      {children}
    </span>
  )
}
