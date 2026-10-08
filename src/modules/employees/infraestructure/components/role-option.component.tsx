import { type JSX, useMemo } from 'react'
import { Tick02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { RoleOption as RoleOptionModel } from '../../domain/role-option.model'

interface Props {
  role: RoleOptionModel
  selected: boolean
  onSelect: (roleId: string) => void
}

export function RoleOption({ role, selected, onSelect }: Props): JSX.Element {
  const rowClassName = useMemo(
    () =>
      cn(
        'flex w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] border px-3 py-2.5 text-left text-[13px] transition-colors',
        selected
          ? 'border-brand-soft-2 bg-brand-soft font-semibold text-brand'
          : 'border-transparent text-ink hover:border-brand-soft-2 hover:bg-brand-soft',
      ),
    [selected],
  )

  const initialClassName = useMemo(
    () =>
      cn(
        'inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold uppercase',
        selected ? 'bg-brand text-white' : 'bg-lavender-bg text-brand',
      ),
    [selected],
  )

  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={rowClassName}
      onClick={() => onSelect(role.id)}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span className={initialClassName}>{role.name.charAt(0)}</span>
        <span className="truncate">{role.name}</span>
      </span>
      {selected && (
        <HugeiconsIcon
          icon={Tick02Icon}
          size={14}
          strokeWidth={2}
          className="shrink-0 text-brand"
        />
      )}
    </button>
  )
}
