import { type JSX } from 'react'
import { SidebarNavItem } from './sidebar-nav-item.component'
import type { SidebarGroup } from './sidebar.routes'

interface Props {
  group: SidebarGroup
  activeId: string
  collapsed: boolean
}

export function SidebarNavSection({ group, activeId, collapsed }: Props): JSX.Element {
  const items = group.items.map((item) => (
    <SidebarNavItem
      key={item.id}
      item={item}
      active={activeId === item.id}
      featured={group.featured}
      collapsed={collapsed}
    />
  ))

  if (group.featured) {
    return (
      <div className="mt-2 mb-4 rounded-[14px] border-[1.5px] border-brand-soft-2 bg-brand-soft p-2 group-data-[collapsed=true]/sidebar:p-1">
        {items}
      </div>
    )
  }

  return (
    <div className="mt-3 first:mt-0">
      <div className="mb-1.5 px-2 group-data-[collapsed=true]/sidebar:px-0">
        <span className="font-mono text-[9px] font-medium uppercase tracking-[0.22em] text-muted group-data-[collapsed=true]/sidebar:hidden">
          {group.title}
        </span>
        <span className="mx-auto my-1 hidden h-px w-4 bg-lavender-line group-data-[collapsed=true]/sidebar:block" />
      </div>
      {items}
    </div>
  )
}
