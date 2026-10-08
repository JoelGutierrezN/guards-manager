import { useMemo, type JSX } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Settings01Icon } from '@hugeicons/core-free-icons'
import { AppRouteHelper } from '../../router/app-route.helper'
import { TopbarBreadcrumbs } from './topbar-breadcrumbs.component'
import { TopbarSearch } from './topbar-search.component'
import { TopbarIconButton } from './topbar-icon-button.component'
import { TopbarNotifications } from './topbar-notifications.component'
import { CommandPalette } from './command-palette.component'
import { useCommandPalette } from './use-command-palette.hook'

export function Topbar(): JSX.Element {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const navId = useMemo(() => AppRouteHelper.navIdFromPath(pathname), [pathname])
  const commandPalette = useCommandPalette()

  return (
    <header className="sticky top-2.5 z-[5] flex h-[60px] items-center gap-3 rounded-[26px] border border-hairline bg-white/75 px-4 shadow-[0_1px_2px_rgba(26,19,38,0.03)] backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <TopbarBreadcrumbs />

      <div className="ml-auto flex items-center gap-2">
        <TopbarSearch onClick={commandPalette.open} />
        <TopbarNotifications />
        <TopbarIconButton
          icon={Settings01Icon}
          tip="Configuración"
          active={navId === 'profile'}
          onClick={() => navigate('/profile')}
        />
      </div>

      <CommandPalette
        isOpen={commandPalette.isOpen}
        query={commandPalette.query}
        onQueryChange={commandPalette.setQuery}
        onClose={commandPalette.close}
      />
    </header>
  )
}
