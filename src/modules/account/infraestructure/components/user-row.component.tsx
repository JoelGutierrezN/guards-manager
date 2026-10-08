import { type JSX, type MouseEvent } from 'react'
import { Delete02Icon, PencilEdit02Icon } from '@hugeicons/core-free-icons'
import { Avatar, IconButton } from '../../../shared/infraestructure/components/ui'
import type { User } from '../../domain/user.entity'
import { UserDateHelper } from '../helpers/user-date.helper'
import { UserContactCell } from './user-contact-cell.component'

interface Props {
  user: User
  onEdit: () => void
  onDelete: () => void
}

export function UserRow({ user, onEdit, onDelete }: Props): JSX.Element {
  const handleEditClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    onEdit()
  }

  const handleDeleteClick = (event: MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation()
    onDelete()
  }

  return (
    <tr className="group transition-colors [&_td]:hover:bg-paper-tint">
      <td className="px-3 py-2.5 align-middle">
        <div className="flex items-center gap-2.5">
          <Avatar name={user.name} size="sm" />
          <span className="truncate text-[13px] font-medium text-ink">{user.name}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[12px] text-muted">{user.username}</td>
      <td className="px-3 py-2.5 align-middle">
        <UserContactCell email={user.email} phone={user.phone} />
      </td>
      <td className="px-3 py-2.5 align-middle font-mono text-[13px] text-muted">
        {UserDateHelper.date(user.createdAt)}
      </td>
      <td className="px-3 py-2.5 text-right align-middle">
        <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton
            icon={PencilEdit02Icon}
            tip="Editar"
            aria-label={`Editar ${user.name}`}
            size="sm"
            onClick={handleEditClick}
          />
          <IconButton
            icon={Delete02Icon}
            tip="Eliminar"
            aria-label={`Eliminar ${user.name}`}
            size="sm"
            danger
            onClick={handleDeleteClick}
          />
        </div>
      </td>
    </tr>
  )
}
