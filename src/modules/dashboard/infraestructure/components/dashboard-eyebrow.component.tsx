import { type JSX, type ReactNode, useMemo } from 'react'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  tone?: 'muted' | 'inverted'
  children: ReactNode
}

export function DashboardEyebrow({ tone = 'muted', children }: Props): JSX.Element {
  const eyebrowClassName = useMemo(
    () =>
      cn(
        'font-mono text-[10px] font-medium tracking-[0.22em] uppercase',
        tone === 'inverted' ? 'text-white/70' : 'text-muted',
      ),
    [tone],
  )

  return <div className={eyebrowClassName}>{children}</div>
}
