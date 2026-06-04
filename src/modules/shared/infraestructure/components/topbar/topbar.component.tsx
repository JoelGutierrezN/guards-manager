import { type JSX } from 'react'
import { InboxIcon, Settings01Icon } from '@hugeicons/core-free-icons'
import { TopbarBreadcrumbs } from './topbar-breadcrumbs.component'
import { TopbarSearch } from './topbar-search.component'
import { TopbarIconButton } from './topbar-icon-button.component'

interface TopbarProps {
  activeId: string
  onNavigate: (id: string) => void
  onSearch?: () => void
  inboxCount?: number
}

export function Topbar({
  activeId,
  onNavigate,
  onSearch,
  inboxCount = 3,
}: TopbarProps): JSX.Element {
  return (
    <header className="sticky top-2.5 z-[5] flex h-[60px] items-center gap-3 rounded-[26px] border border-hairline bg-white/75 px-4 shadow-[0_1px_2px_rgba(26,19,38,0.03)] backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <TopbarBreadcrumbs activeId={activeId} />

      <div className="ml-auto flex items-center gap-2">
        <TopbarSearch onClick={onSearch} />
        <TopbarIconButton
          icon={InboxIcon}
          tip="Mi bandeja"
          badge={inboxCount}
          active={activeId === 'inbox'}
          onClick={() => onNavigate('inbox')}
        />
        <TopbarIconButton
          icon={Settings01Icon}
          tip="Configuración"
          active={activeId === 'settings'}
          onClick={() => onNavigate('settings')}
        />
      </div>
    </header>
  )
}
