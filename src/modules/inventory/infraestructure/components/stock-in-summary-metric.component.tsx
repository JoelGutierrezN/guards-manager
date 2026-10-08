import { type JSX } from 'react'

interface Props {
  label: string
  value: number
}

export function StockInSummaryMetric({ label, value }: Props): JSX.Element {
  return (
    <div className="rounded-[14px] border border-hairline bg-white px-3 py-2">
      <p className="m-0 text-[11px] tracking-[0.04em] text-muted uppercase">{label}</p>
      <p className="m-0 font-mono text-[16px] font-semibold text-ink tabular-nums">{value}</p>
    </div>
  )
}
