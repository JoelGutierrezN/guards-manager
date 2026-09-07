import { type JSX, useMemo } from 'react'
import { ArrowDown01Icon, ArrowUp01Icon, ArrowUpDownIcon } from '@hugeicons/core-free-icons'
import { Icon } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { ToolsSort, ToolsSortKey } from '../../domain/tools-sort.model'

interface Props {
  label: string
  sortKey: ToolsSortKey
  sort: ToolsSort
  onToggle: (key: ToolsSortKey) => void
}

export function ToolTableSortHeader({ label, sortKey, sort, onToggle }: Props): JSX.Element {
  const isActive = sort.key === sortKey
  const isAscending = isActive && sort.direction === 'asc'

  const buttonClassName = useMemo(
    () =>
      cn(
        'inline-flex cursor-pointer items-center gap-1 select-none transition-colors',
        isActive ? 'text-brand' : 'text-muted hover:text-ink',
      ),
    [isActive],
  )

  const icon = useMemo(() => {
    if (!isActive) return ArrowUpDownIcon
    return isAscending ? ArrowUp01Icon : ArrowDown01Icon
  }, [isActive, isAscending])

  return (
    <button
      type="button"
      className={buttonClassName}
      aria-label={`Ordenar por ${label}`}
      onClick={() => onToggle(sortKey)}
    >
      {label}
      <Icon icon={icon} size={11} />
    </button>
  )
}
