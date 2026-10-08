import { type JSX } from 'react'
import { SIDEBAR_GROUPS } from './sidebar.routes'
import { SidebarNavSection } from './sidebar-nav-section.component'

interface SidebarNavProps {
  activeId: string
  collapsed: boolean
}

export function SidebarNav({ activeId, collapsed }: SidebarNavProps): JSX.Element {
  return (
    <nav className="sidebar-scroll -mx-2.5 flex-1 px-2.5">
      {SIDEBAR_GROUPS.map((group) => (
        <SidebarNavSection
          key={group.title}
          group={group}
          activeId={activeId}
          collapsed={collapsed}
        />
      ))}
    </nav>
  )
}
