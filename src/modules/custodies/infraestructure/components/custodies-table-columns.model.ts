export interface CustodiesTableColumn {
  key: string
  label: string
  widthClass?: string
}

export const CUSTODIES_COLUMNS: CustodiesTableColumn[] = [
  { key: 'code', label: 'Folio', widthClass: 'w-32' },
  { key: 'employee', label: 'Empleado' },
  { key: 'items', label: 'Ítems', widthClass: 'w-20' },
  { key: 'pending', label: 'Pendientes', widthClass: 'w-28' },
  { key: 'status', label: 'Estado', widthClass: 'w-48' },
  { key: 'createdAt', label: 'Fecha', widthClass: 'w-32' },
  { key: 'signature', label: 'Firma', widthClass: 'w-28' },
]
