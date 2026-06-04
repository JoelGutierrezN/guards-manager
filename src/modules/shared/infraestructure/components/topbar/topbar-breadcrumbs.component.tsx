import { Fragment, type JSX } from 'react'
import { Home09Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { resolveCrumb } from './topbar.crumbs'

interface TopbarBreadcrumbsProps {
  activeId: string
}

export function TopbarBreadcrumbs({ activeId }: TopbarBreadcrumbsProps): JSX.Element {
  const segments = resolveCrumb(activeId)

  return (
    <div className="flex items-center gap-1.5 text-[12px] text-muted">
      <HugeiconsIcon icon={Home09Icon} size={13} strokeWidth={1.8} className="text-muted" />
      <span className="text-muted-soft">/</span>
      {segments.map((segment, i) => {
        const isLast = i === segments.length - 1
        return (
          <Fragment key={`${segment}-${i}`}>
            <span className={isLast ? 'font-semibold text-ink' : undefined}>{segment}</span>
            {!isLast && <span className="text-muted-soft">/</span>}
          </Fragment>
        )
      })}
    </div>
  )
}
