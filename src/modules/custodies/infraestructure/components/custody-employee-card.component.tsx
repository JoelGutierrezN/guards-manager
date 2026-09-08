import { type JSX } from 'react'
import { Link } from 'react-router'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import { Avatar, Icon } from '../../../shared/infraestructure/components/ui'
import type { CustodyEmployee } from '../../domain/custody.entity'

interface Props {
  employee: CustodyEmployee
}

export function CustodyEmployeeCard({ employee }: Props): JSX.Element {
  return (
    <section className="rounded-[18px] border border-hairline bg-white p-4 shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <h2 className="mb-3 font-mono text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
        Empleado
      </h2>
      <div className="flex items-center gap-3">
        <Avatar name={employee.name} size="md" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[14px] font-semibold text-ink">{employee.name}</span>
          <span className="font-mono text-[11px] text-muted">{employee.identifier}</span>
          {employee.roleName != null && (
            <span className="text-[12px] text-ink-3">{employee.roleName}</span>
          )}
        </div>
      </div>
      <Link
        to={`/personal/${employee.id}`}
        className="mt-3 inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-[12px] font-semibold text-brand transition-colors hover:bg-brand-soft"
      >
        Ver expediente
        <Icon icon={ArrowRight01Icon} size={13} />
      </Link>
    </section>
  )
}
