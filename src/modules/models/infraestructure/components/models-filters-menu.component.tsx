import { type JSX, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown01Icon, FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import type { ModelsFilters, ModelStateOption } from '../../domain/models-filters.model'
import { MODEL_STATE_OPTIONS, MODELS_FILTER_TOGGLES } from '../../domain/models-filters.model'
import { Checkbox, FilterStateOption } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'

interface Props {
  filters: ModelsFilters
  onChange: (filters: Partial<ModelsFilters>) => void
}

export function ModelsFiltersMenu({ filters, onChange }: Props): JSX.Element {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOnOutsideClick = (event: MouseEvent): void => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', closeOnOutsideClick)
    return () => document.removeEventListener('mousedown', closeOnOutsideClick)
  }, [open])

  const activeCount = useMemo(
    () =>
      (filters.state !== 'todos' ? 1 : 0) +
      (filters.withExistences ? 1 : 0) +
      (filters.assigned ? 1 : 0),
    [filters],
  )

  const triggerClassName = useMemo(
    () =>
      cn(
        'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[12px] font-semibold transition-[background,border-color,color]',
        open || activeCount > 0
          ? 'border-brand-mid bg-brand-soft text-brand-active'
          : 'border-hairline bg-white text-ink-2 hover:border-brand-mid hover:text-ink',
      ),
    [open, activeCount],
  )

  const selectState = (option: ModelStateOption): void => {
    onChange({ state: option.value })
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <HugeiconsIcon icon={FilterHorizontalIcon} size={14} strokeWidth={1.8} />
        <span>Filtros</span>
        {activeCount > 0 && (
          <span className="rounded-full bg-brand px-1.5 py-px text-[10px] font-semibold tabular-nums text-white">
            {activeCount}
          </span>
        )}
        <HugeiconsIcon icon={ArrowDown01Icon} size={13} strokeWidth={1.8} />
      </button>
      {open && (
        <div className="absolute left-0 z-20 mt-1 w-56 rounded-[14px] border border-hairline bg-white p-2 shadow-[0_8px_24px_rgba(14,15,60,0.12)]">
          <p className="px-2.5 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.08em] text-muted uppercase">
            Estado
          </p>
          <ul>
            {MODEL_STATE_OPTIONS.map((option) => (
              <li key={option.value}>
                <FilterStateOption
                  option={option}
                  selected={filters.state === option.value}
                  onSelect={selectState}
                />
              </li>
            ))}
          </ul>
          <div className="my-2 border-t border-hairline" />
          <p className="px-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.08em] text-muted uppercase">
            Existencias
          </p>
          <ul>
            {MODELS_FILTER_TOGGLES.map((toggle) => (
              <li key={toggle.key} className="px-2.5 py-1.5">
                <Checkbox
                  label={toggle.label}
                  checked={filters[toggle.key]}
                  onChange={(event) => onChange({ [toggle.key]: event.target.checked })}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
