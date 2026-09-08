import { type JSX, type ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
}

export function CustodySummaryRow({ label, children }: Props): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hairline py-2 last:border-b-0">
      <dt className="text-[12px] text-muted">{label}</dt>
      <dd className="text-right text-[12px] font-medium text-ink">{children}</dd>
    </div>
  )
}
