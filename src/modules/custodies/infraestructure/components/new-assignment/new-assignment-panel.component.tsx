import { type JSX, type ReactNode } from 'react'

interface Props {
  title: string
  hint?: string
  actions?: ReactNode
  children: ReactNode
}

export function NewAssignmentPanel({ title, hint, actions, children }: Props): JSX.Element {
  return (
    <section className="rounded-[18px] border border-hairline bg-white p-5">
      <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-[14px] font-semibold text-ink">{title}</h2>
          {hint && <p className="m-0 text-[12px] text-muted">{hint}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </header>
      {children}
    </section>
  )
}
