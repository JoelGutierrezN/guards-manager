import { type JSX, type ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
}

export function EmployeeFileIdentityRow({ label, children }: Props): JSX.Element {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="shrink-0 text-muted">{label}</span>
      {children}
    </div>
  )
}
