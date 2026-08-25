import { type JSX, useMemo } from 'react'
import { Avatar, Chip } from '../../../shared/infraestructure/components/ui'
import { cn } from '../../../shared/infraestructure/utils/cn'
import type { EmployeeFileProfile } from '../../domain/employee-file.entity'
import { EmployeeFileIdentityRow } from './employee-file-identity-row.component'

interface Props {
  employee: EmployeeFileProfile
}

const EMPTY_VALUE = '—'

export function EmployeeFileIdentityCard({ employee }: Props): JSX.Element {
  const currentYear = useMemo(() => new Date().getFullYear(), [])

  const phoneClassName = useMemo(
    () => cn('font-mono text-[11px]', employee.phone === null && 'text-muted-soft'),
    [employee.phone],
  )

  const emailClassName = useMemo(
    () =>
      cn(
        'max-w-[160px] truncate font-mono text-[11px]',
        employee.email === null && 'text-muted-soft',
      ),
    [employee.email],
  )

  return (
    <div className="overflow-hidden rounded-[26px] border border-hairline bg-white shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
      <div className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-brand-mid)_0%,var(--color-brand-deep)_100%)] p-[20px_18px_16px] text-cream">
        <span className="absolute top-2.5 right-3.5 font-mono text-[9px] tracking-[0.18em] opacity-60">
          ETTS · {currentYear}
        </span>
        <Avatar name={employee.name} size="xl" tone="navy" />
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[16px] font-semibold tracking-[-0.01em]">{employee.name}</span>
          {employee.status === 'inactivo' && <Chip size="sm">Inactivo</Chip>}
        </div>
        <div className="mt-0.5 font-mono text-[11px] tracking-[0.08em] opacity-70">
          {employee.identifier}
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3.5 text-[12px]">
        <EmployeeFileIdentityRow label="Rol">
          <b className="truncate text-ink">{employee.roleName}</b>
        </EmployeeFileIdentityRow>
        <EmployeeFileIdentityRow label="Teléfono">
          <span className={phoneClassName}>{employee.phone ?? EMPTY_VALUE}</span>
        </EmployeeFileIdentityRow>
        <EmployeeFileIdentityRow label="Email">
          <span className={emailClassName} title={employee.email ?? undefined}>
            {employee.email ?? EMPTY_VALUE}
          </span>
        </EmployeeFileIdentityRow>
      </div>
    </div>
  )
}
