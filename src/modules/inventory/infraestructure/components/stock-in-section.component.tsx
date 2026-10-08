import { type JSX, type ReactNode } from 'react'

interface Props {
  step: number
  title: string
  hint?: string
  children: ReactNode
}

export function StockInSection({ step, title, hint, children }: Props): JSX.Element {
  return (
    <section className="rounded-[18px] border border-hairline bg-white p-5">
      <header className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft font-mono text-[12px] font-semibold text-brand">
          {step}
        </span>
        <div>
          <h2 className="m-0 text-[14px] font-semibold text-ink">{title}</h2>
          {hint && <p className="m-0 text-[12px] text-muted">{hint}</p>}
        </div>
      </header>
      {children}
    </section>
  )
}
