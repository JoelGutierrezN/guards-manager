import { useMemo, type JSX } from 'react'
import { useLocation, useNavigate } from 'react-router'
import './sidebar.css'
import { SidebarBrand } from './sidebar-brand.component'
import { SidebarNav } from './sidebar-nav.component'
import { SidebarUserCard } from './sidebar-user-card.component'
import { SidebarCollapseButton } from './sidebar-collapse-button.component'
import { useSidebarCollapse } from './use-sidebar-collapse.hook'
import { AppRouteHelper } from '../../router/app-route.helper'
import { useAuth } from '../../../../auth/hooks/use-auth.hook'

const STATIC_ROLE = 'Almacén · Admin'

export function Sidebar(): JSX.Element {
  const { collapsed, toggle } = useSidebarCollapse()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const activeId = useMemo(() => AppRouteHelper.activeIdFromPath(pathname), [pathname])
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div
      data-collapsed={collapsed}
      className="group/sidebar sticky top-2.5 h-[calc(100vh-1.25rem)] w-[244px] shrink-0 transition-[width] duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] data-[collapsed=true]:w-16"
    >
      <aside className="sidebar-surface relative flex h-full flex-col overflow-hidden rounded-[32px] border border-lavender-line bg-lavender-bg px-2.5 py-3 text-ink [&>*]:relative [&>*]:z-[1]">
        <SidebarBrand />
        <SidebarNav activeId={activeId} collapsed={collapsed} />
        <SidebarUserCard name={user?.getName() ?? '—'} role={STATIC_ROLE} onLogout={handleLogout} />
      </aside>
      <SidebarCollapseButton onToggle={toggle} />
    </div>
  )
}
