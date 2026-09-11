import { type JSX, type ReactNode } from 'react'
import { PackageIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface Props {
  children: ReactNode
}

export function GuestAuthLayout({ children }: Props): JSX.Element {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
            <HugeiconsIcon icon={PackageIcon} strokeWidth={1.5} className="text-cream" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-ink">ETTS</span>
        </div>
        {children}
      </div>
    </div>
  )
}
