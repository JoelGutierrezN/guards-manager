import { type JSX, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export function DashboardCellTitle({ children }: Props): JSX.Element {
  return (
    <h2 className="m-0 mt-1.5 text-[20px] leading-[1.15] font-medium tracking-[-0.025em] text-ink">
      {children}
    </h2>
  )
}
