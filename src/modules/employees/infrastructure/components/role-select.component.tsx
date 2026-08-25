import { type JSX, useMemo, useState } from 'react'
import { ArrowDown01Icon, UserAccountIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { RoleOption as RoleOptionModel } from '../../domain/role-option.model'
import type { RolesStatus } from '../../application/employee-form.model'
import { RoleOption } from './role-option.component'

interface Props {
  label: string
  value: string
  options: RoleOptionModel[]
  status: RolesStatus
  error?: string
  onChange: (roleId: string) => void
}

export function RoleSelect({ label, value, options, status, error, onChange }: Props): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)

  const isLoading = status === 'loading' || status === 'idle'
  const hasLoadError = status === 'error'
  const hasError = error != null || hasLoadError
  const selectedRole = options.find((role) => role.id === value) ?? null

  const triggerClassName = useMemo(
    () =>
      cn(
        'flex h-[44px] w-full cursor-pointer items-center gap-2 rounded-full border bg-white px-4 text-left text-[13px] transition-[border-color,box-shadow,background]',
        hasError
          ? 'border-danger focus-visible:shadow-[0_0_0_3px_var(--color-danger-soft)]'
          : 'border-hairline-strong hover:border-ink-3 focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--color-brand-soft)]',
        isOpen && !hasError && 'border-brand shadow-[0_0_0_3px_var(--color-brand-soft)]',
        isLoading && 'cursor-wait bg-cream',
        'outline-none',
      ),
    [hasError, isOpen, isLoading],
  )

  const valueClassName = useMemo(
    () => cn('min-w-0 flex-1 truncate', selectedRole ? 'text-ink' : 'text-muted-soft'),
    [selectedRole],
  )

  const chevronClassName = useMemo(
    () =>
      cn(
        'shrink-0 text-muted transition-transform duration-200',
        isOpen && 'rotate-180 text-brand',
      ),
    [isOpen],
  )

  const triggerText = isLoading ? 'Cargando roles…' : (selectedRole?.name ?? 'Selecciona rol…')
  const helpText = hasLoadError ? 'No se pudieron cargar los roles.' : error

  const handleSelect = (roleId: string) => {
    onChange(roleId)
    setIsOpen(false)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center justify-between text-[12px] font-medium text-ink-2">
        <span>
          {label} <span className="text-danger">*</span>
        </span>
        <span className="font-mono text-[10px] font-medium tracking-[0.06em] text-muted uppercase">
          catálogo
        </span>
      </label>

      <div className="relative">
        <button
          type="button"
          className={triggerClassName}
          disabled={isLoading}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="inline-flex shrink-0 text-muted">
            <HugeiconsIcon icon={UserAccountIcon} size={14} strokeWidth={1.8} />
          </span>
          <span className={valueClassName}>{triggerText}</span>
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={14}
            strokeWidth={1.8}
            className={chevronClassName}
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-[4]" onClick={() => setIsOpen(false)} />
            <div
              role="listbox"
              className="absolute top-[calc(100%+6px)] right-0 left-0 z-[6] flex max-h-[260px] flex-col gap-0.5 overflow-auto rounded-[16px] border border-hairline bg-white p-1.5 shadow-[0_12px_36px_-8px_rgba(14,15,60,0.18)]"
            >
              <div className="px-3 pt-1.5 pb-1 font-mono text-[10px] font-medium tracking-[0.14em] text-muted uppercase">
                Roles disponibles
              </div>
              {options.map((role) => (
                <RoleOption
                  key={role.id}
                  role={role}
                  selected={role.id === value}
                  onSelect={handleSelect}
                />
              ))}
              {options.length === 0 && (
                <div className="py-4 text-center text-[13px] text-muted">Sin roles registrados</div>
              )}
            </div>
          </>
        )}
      </div>

      {helpText && <span className="text-[11px] text-danger">{helpText}</span>}
    </div>
  )
}
