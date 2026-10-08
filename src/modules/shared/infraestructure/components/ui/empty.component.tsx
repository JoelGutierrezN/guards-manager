import { type JSX, type ReactNode } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import type { IconSvgElement } from '@hugeicons/react'

interface Props {
  icon?: IconSvgElement
  title: string
  body?: ReactNode
  action?: ReactNode
}

export function Empty({ icon, title, body, action }: Props): JSX.Element {
  return (
    <div className="px-6 py-14 text-center text-muted">
      {icon && (
        <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-cream-2 text-ink-3">
          <HugeiconsIcon icon={icon} size={22} strokeWidth={1.8} />
        </div>
      )}
      <div className="mb-1 text-[14px] font-semibold text-ink">{title}</div>
      {body && <div className="mb-4">{body}</div>}
      {action}
    </div>
  )
}
