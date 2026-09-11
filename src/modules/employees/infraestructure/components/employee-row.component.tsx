import { type JSX, type KeyboardEvent, type MouseEvent, useMemo } from 'react'
import {
  Delete02Icon,
  PencilEdit02Icon,
  UserBlock01Icon,
  UserCheck01Icon,
} from '@hugeicons/core-free-icons'
import { Avatar, Chip, IconButton } from '../../../shared/infraestructure/components/ui'
import type { Employee } from '../../domain/employee.entity'
import { EmployeeStatusHelper } from '../../application/employee-status.helper'
import { EmployeeLifecycleTextsHelper } from '../../application/employee-lifecycle-texts.helper'
import { EmployeeContactCell } from './employee-contact-cell.component'

interface Props {
  employee: Employee
  onEdit: () => void
  onOpen: () => void
  onChangeStatus: () => void
  onDelete: () => void
}

export function EmployeeRow({
  employee,
  onEdit,
  onOpen,
  onChangeStatus,
  onDelete,
}: Props): JSX.Element {
  const isActive = EmployeeStatusHelper.isActive(employee.status)
  const statusActionTitle = useMemo(
    () => EmployeeLifecycleTextsHelper.statusActionLabel(employee.status),
    [employee.status],
  )

  const handleEditClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    onEdit()
  }

  const handleStatusClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    onChangeStatus()
  }

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    onDelete()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTableRowElement>): void => {
    // El teclado sobre el botón de editar no debe abrir el expediente: sólo la propia fila.
    if (event.target !== event.currentTarget) return
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    onOpen()
  }

  return (
    <tr
      className="group cursor-pointer transition-colors outline-none [&_td]:hover:bg-paper-tint [&_td]:focus-visible:bg-paper-tint"
      tabIndex={0}
      aria-label={`Abrir expediente de ${employee.name}`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
    >
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-2.5">
          <Avatar name={employee.name} size="sm" />
          <div className="flex min-w-0 flex-col">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="truncate text-[13px] font-medium text-ink">{employee.name}</span>
              {!isActive && <Chip size="sm">Inactivo</Chip>}
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
      <td className="px-3 py-2.5 text-right align-middle">
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton icon={PencilEdit02Icon} tip="Editar" size="sm" onClick={handleEditClick} />
          <IconButton
            icon={isActive ? UserBlock01Icon : UserCheck01Icon}
            tip={statusActionTitle}
            size="sm"
            onClick={handleStatusClick}
          />
          <IconButton
            icon={Delete02Icon}
            tip="Eliminar"
            size="sm"
            danger
            onClick={handleDeleteClick}
          />
        </div>
      </td>
    </tr>
  )
}
