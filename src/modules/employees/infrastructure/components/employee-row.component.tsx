import { type JSX } from 'react'
import { PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { Avatar, Chip, IconButton } from '../../../shared/infraestructure/components/ui'
import type { Employee } from '../../domain/employee.entity'
import { EmployeeContactCell } from './employee-contact-cell.component'

interface Props {
  employee: Employee
  onEdit: () => void
}

export function EmployeeRow({ employee, onEdit }: Props): JSX.Element {
  return (
    <tr className="group transition-colors [&_td]:hover:bg-paper-tint">
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-2.5">
          <Avatar name={employee.name} size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[13px] font-medium text-ink">{employee.name}</span>
              {employee.status === 'inactivo' && <Chip size="sm">Inactivo</Chip>}
            </span>
            <span className="font-mono text-[11px] text-muted">{employee.identifier}</span>
          </div>
        </div>
      </td>
      <td className="px-3 py-2.5 align-middle">
        <Chip size="sm">{employee.roleName}</Chip>
      </td>
      <td className="px-3 py-2.5 align-middle">
        <EmployeeContactCell email={employee.email} phone={employee.phone} />
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] font-medium text-ink-2">
        {employee.activeToolsCount}
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
        {employee.historicalToolsCount}
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
        {employee.hireDate}
      </td>
      {/* TODO API: eliminar empleado con DELETE /employees/{id}. */}
      <td className="px-3 py-2.5 text-right align-middle">
        <div className="flex justify-end opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton icon={PencilEdit02Icon} tip="Editar" size="sm" onClick={onEdit} />
        </div>
      </td>
    </tr>
  )
}
