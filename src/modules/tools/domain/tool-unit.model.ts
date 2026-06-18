export type InutilState = 'dañado' | 'roto' | 'perdido' | 'baja'

export const INUTIL_STATES: InutilState[] = ['dañado', 'roto', 'perdido', 'baja']

export const INUTIL_STATE_LABEL: Record<InutilState, string> = {
  dañado: 'dañado',
  roto: 'roto',
  perdido: 'perdido',
  baja: 'baja',
}

export interface ToolUnit {
  serial: string
  name: string
  brand: string
  model: string
}

export interface AssignedToolUnit extends ToolUnit {
  assignee: string
  since: string
}

export interface InutilToolUnit extends ToolUnit {
  state: InutilState
}

export interface ToolUnits {
  disponibles: ToolUnit[]
  asignadas: AssignedToolUnit[]
  inutilizables: InutilToolUnit[]
}
