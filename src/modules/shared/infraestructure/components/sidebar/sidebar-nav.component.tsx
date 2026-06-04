import { type JSX } from 'react'
import { SidebarNavItem } from './sidebar-nav-item.component'
import { SIDEBAR_GROUPS, type SidebarGroup } from './sidebar.routes'

interface SidebarNavProps {
  activeId: string
  collapsed: boolean
  onSelect: (id: string) => void
}

export function SidebarNav({
  activeId,
  collapsed,
  onSelect,
}: SidebarNavProps): JSX.Element {
  return (
    <nav className="sidebar-scroll -mx-2.5 flex-1 px-2.5">
      {SIDEBAR_GROUPS.map((group) => (
        <NavSection
          key={group.title}
          group={group}
          activeId={activeId}
          collapsed={collapsed}
          onSelect={onSelect}
        />
      ))}
    </nav>
  )
}

interface NavSectionProps {
  group: SidebarGroup
  activeId: string
  collapsed: boolean
  onSelect: (id: string) => void
}

function NavSection({
  group,
  activeId,
  collapsed,
  onSelect,
}: NavSectionProps): JSX.Element {
  const items = group.items.map((item) => (
    <SidebarNavItem
      key={item.id}
      item={item}
      active={activeId === item.id}
      featured={group.featured}
      collapsed={collapsed}
      onSelect={onSelect}
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
