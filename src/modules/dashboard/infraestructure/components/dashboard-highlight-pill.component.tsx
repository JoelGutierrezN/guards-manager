import { type JSX, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function DashboardHighlightPill({ children }: Props): JSX.Element {
  return (
    <span className="inline-flex h-[22px] items-center gap-[5px] rounded-full border border-white/25 bg-white/20 px-[9px] font-mono text-[11px] font-medium tracking-[0.04em] whitespace-nowrap text-white">
      {children}
    </span>
  )
}
