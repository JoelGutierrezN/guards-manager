import { type JSX } from 'react'
import { Home09Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { resolveCrumb } from './topbar.crumbs'
import { TopbarBreadcrumbSegment } from './topbar-breadcrumb-segment.component'

interface Props {
  activeId: string
}

export function TopbarBreadcrumbs({ activeId }: Props): JSX.Element {
  const segments = resolveCrumb(activeId)

  return (
    <div className="flex items-center gap-1.5 text-[12px] text-muted">
      <HugeiconsIcon icon={Home09Icon} size={13} strokeWidth={1.8} className="text-muted" />
      <span className="text-muted-soft">/</span>
      {segments.map((segment, index) => (
        <TopbarBreadcrumbSegment
          key={`${segment}-${index}`}
          segment={segment}
          isLast={index === segments.length - 1}
        />
      ))}
    </div>
  )
}
