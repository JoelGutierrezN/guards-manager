import { useMemo, type JSX } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { InboxIcon, Settings01Icon } from '@hugeicons/core-free-icons'
import { AppRouteHelper } from '../../router/app-route.helper'
import { TopbarBreadcrumbs } from './topbar-breadcrumbs.component'
import { TopbarSearch } from './topbar-search.component'
import { TopbarIconButton } from './topbar-icon-button.component'

interface Props {
  onSearch?: () => void
  inboxCount?: number
}

export function Topbar({ onSearch, inboxCount = 3 }: Props): JSX.Element {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navId = useMemo(() => AppRouteHelper.navIdFromPath(pathname), [pathname])

  return (
    <header className="sticky top-2.5 z-[5] flex h-[60px] items-center gap-3 rounded-[26px] border border-hairline bg-white/75 px-4 shadow-[0_1px_2px_rgba(26,19,38,0.03)] backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <TopbarBreadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <TopbarSearch onClick={onSearch} />
        <TopbarIconButton
          icon={InboxIcon}
          tip="Mi bandeja"
          badge={inboxCount}
          active={navId === 'inbox'}
          onClick={() => navigate(AppRouteHelper.pathForId('inbox'))}
        />
        <TopbarIconButton
          icon={Settings01Icon}
          tip="Configuración"
          active={navId === 'settings'}
          onClick={() => navigate(AppRouteHelper.pathForId('settings'))}
        />
      </div>
    </header>
  )
}
