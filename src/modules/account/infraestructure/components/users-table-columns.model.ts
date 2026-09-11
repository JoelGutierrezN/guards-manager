export interface UsersTableColumn {
  key: string
  label: string
  widthClass?: string
}

export const USERS_COLUMNS: UsersTableColumn[] = [
  { key: 'name', label: 'Nombre' },
  { key: 'username', label: 'Usuario', widthClass: 'w-40' },
  { key: 'contact', label: 'Contacto', widthClass: 'w-55' },
  { key: 'createdAt', label: 'Alta', widthClass: 'w-32' },
  { key: 'actions', label: '', widthClass: 'w-16' },
]
