import { type JSX, useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown01Icon, FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import {
  FilterStateOption,
  type FilterStateOptionItem,
} from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { CustodiesFilters } from '../../domain/custodies-filters.model'
import { CUSTODY_STATUS_OPTIONS, type CustodyStatus } from '../../domain/custody-status.model'
import { CustodiesFiltersHelper } from '../../application/custodies-filters.helper'
import { CustodyEmployeeFilter } from './custody-employee-filter.component'

interface Props {
  filters: CustodiesFilters
  onChange: (filters: Partial<CustodiesFilters>) => void
  onClear: () => void
}

const SECTION_TITLE_CLASS =
  'px-2.5 pb-1.5 text-[10px] font-semibold tracking-[0.08em] text-muted uppercase'
const DATE_INPUT_CLASS =
  'h-8 w-full rounded-lg border border-hairline-strong bg-white px-2 text-[12px] text-ink outline-none transition-[border-color] hover:border-ink-3 focus:border-brand'

export function CustodiesFiltersMenu({ filters, onChange, onClear }: Props): JSX.Element {
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

  const activeCount = useMemo(() => CustodiesFiltersHelper.activeCount(filters), [filters])

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

  const toggleStatus = (option: FilterStateOptionItem<CustodyStatus>): void => {
    onChange({ statuses: CustodiesFiltersHelper.toggleStatus(filters.statuses, option.value) })
  }

  const selectEmployee = (employeeId: string, employeeName: string): void => {
    onChange({ employeeId, employeeName })
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
        <div className="absolute left-0 z-20 mt-1 w-72 rounded-[14px] border border-hairline bg-white p-2 shadow-[0_8px_24px_rgba(14,15,60,0.12)]">
          <p className={cn(SECTION_TITLE_CLASS, 'pt-1')}>Estado</p>
          <ul>
            {CUSTODY_STATUS_OPTIONS.map((option) => (
              <li key={option.value}>
                <FilterStateOption
                  option={option}
                  selected={filters.statuses.includes(option.value)}
                  onSelect={toggleStatus}
                />
              </li>
            ))}
          </ul>

          <div className="my-2 border-t border-hairline" />
          <p className={SECTION_TITLE_CLASS}>Empleado</p>
          <div className="px-2.5 py-1.5">
            <CustodyEmployeeFilter
              employeeId={filters.employeeId}
              employeeName={filters.employeeName}
              onChange={selectEmployee}
            />
          </div>

          <div className="my-2 border-t border-hairline" />
          <p className={SECTION_TITLE_CLASS}>Fecha de registro</p>
          <div className="grid grid-cols-2 gap-2 px-2.5 py-1.5">
            <label className="flex flex-col gap-1 text-[11px] text-muted">
              Desde
              <input
                type="date"
                aria-label="Resguardos desde"
                className={DATE_INPUT_CLASS}
                value={filters.dateFrom}
                max={filters.dateTo || undefined}
                onChange={(event) => onChange({ dateFrom: event.target.value })}
              />
            </label>
            <label className="flex flex-col gap-1 text-[11px] text-muted">
              Hasta
              <input
                type="date"
                aria-label="Resguardos hasta"
                className={DATE_INPUT_CLASS}
                value={filters.dateTo}
                min={filters.dateFrom || undefined}
                onChange={(event) => onChange({ dateTo: event.target.value })}
              />
            </label>
          </div>

          {activeCount > 0 && (
            <>
              <div className="my-2 border-t border-hairline" />
              <button
                type="button"
                className="w-full cursor-pointer rounded-lg px-2.5 py-2 text-left text-[12px] font-semibold text-brand transition-colors hover:bg-cream"
                onClick={onClear}
              >
                Limpiar filtros
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
