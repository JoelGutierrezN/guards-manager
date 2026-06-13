import { useMemo, type JSX } from 'react'
import { useLocation } from 'react-router'
import './sidebar.css'
import { SidebarBrand } from './sidebar-brand.component'
import { SidebarNav } from './sidebar-nav.component'
import { SidebarUserCard } from './sidebar-user-card.component'
import { SidebarCollapseButton } from './sidebar-collapse-button.component'
import { useSidebarCollapse } from './use-sidebar-collapse.hook'
import { AppRouteHelper } from '../../router/app-route.helper'

interface SidebarUser {
  name: string
  role: string
}

interface Props {
  user?: SidebarUser
}

const DEFAULT_USER: SidebarUser = {
  name: 'José Martínez',
  role: 'Almacén · Admin',
}

export function Sidebar({ user = DEFAULT_USER }: Props): JSX.Element {
  const { collapsed, toggle } = useSidebarCollapse()
  const { pathname } = useLocation()
  const activeId = useMemo(() => AppRouteHelper.activeIdFromPath(pathname), [pathname])

  return (
    <div
      data-collapsed={collapsed}
      className="group/sidebar sticky top-2.5 h-[calc(100vh-1.25rem)] w-[244px] shrink-0 transition-[width] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] data-[collapsed=true]:w-16"
    >
      <aside className="sidebar-surface relative flex h-full flex-col overflow-hidden rounded-[32px] border border-lavender-line bg-lavender-bg px-2.5 py-3 text-ink [&>*]:relative [&>*]:z-[1]">
        <SidebarBrand />
        <SidebarNav activeId={activeId} collapsed={collapsed} />
        <SidebarUserCard name={user.name} role={user.role} />
      </aside>
      <SidebarCollapseButton onToggle={toggle} />
    </div>
  )
}
