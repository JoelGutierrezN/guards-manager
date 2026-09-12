import { type JSX, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { Modal } from '../ui'
import { SIDEBAR_GROUPS } from '../sidebar'
import { CommandPaletteHelper } from './command-palette.helper'
import { CommandPaletteItem } from './command-palette-item.component'

interface Props {
  isOpen: boolean
  query: string
  onQueryChange: (query: string) => void
  onClose: () => void
}

export function CommandPalette({ isOpen, query, onQueryChange, onClose }: Props): JSX.Element {
  const navigate = useNavigate()

  const navigationItems = useMemo(() => {
    const allItems = CommandPaletteHelper.buildNavigationItems(SIDEBAR_GROUPS)
    return CommandPaletteHelper.filterNavigationItems(allItems, query)
  }, [query])

  const searchActions = useMemo(() => CommandPaletteHelper.buildSearchActions(query), [query])

  const goTo = (path: string): void => {
    onClose()
    navigate(path)
  }

  return (
    <Modal open={isOpen} onClose={onClose} maxWidth={560} className="max-h-[70vh]">
      <div className="flex flex-col">
        <div className="flex items-center gap-2.5 border-b border-hairline px-4 py-3">
          <HugeiconsIcon icon={Search01Icon} size={16} strokeWidth={1.8} className="text-muted" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Buscar una pantalla o escribe para buscar en Personal, Herramientas o Resguardos…"
            className="h-8 flex-1 border-none bg-transparent text-[14px] text-ink outline-none placeholder:text-muted-soft"
          />
        </div>

        <div className="flex max-h-[420px] flex-col gap-1 overflow-y-auto p-2">
          {searchActions.length > 0 && (
            <div className="flex flex-col gap-1">
              <span className="px-3 pt-1 text-[11px] font-semibold tracking-[0.04em] text-muted-soft uppercase">
                Buscar
              </span>
              {searchActions.map((action) => (
                <CommandPaletteItem
                  key={action.id}
                  label={action.label}
                  onSelect={() => goTo(action.path)}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <span className="px-3 pt-1 text-[11px] font-semibold tracking-[0.04em] text-muted-soft uppercase">
              Navegación
            </span>
            {navigationItems.length === 0 && (
              <div className="px-3 py-6 text-center text-[12px] text-muted">Sin resultados.</div>
            )}
            {navigationItems.map((item) => (
              <CommandPaletteItem
                key={item.id}
                label={item.label}
                icon={item.icon}
                onSelect={() => goTo(item.path)}
              />
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}
