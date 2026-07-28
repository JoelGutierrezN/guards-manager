export type ModelStateFilter = 'todos' | 'activo' | 'baja'

export interface ModelsFilters {
  state: ModelStateFilter
  withExistences: boolean
  assigned: boolean
}

export const INITIAL_MODELS_FILTERS: ModelsFilters = {
  state: 'todos',
  withExistences: false,
  assigned: false,
}

export interface ModelStateOption {
  value: ModelStateFilter
  label: string
}

export const MODEL_STATE_OPTIONS: ModelStateOption[] = [
  { value: 'todos', label: 'Todos' },
  { value: 'activo', label: 'Activos' },
  { value: 'baja', label: 'Inactivos' },
]

export type ModelsFilterToggleKey = 'withExistences' | 'assigned'

export interface ModelsFilterToggle {
  key: ModelsFilterToggleKey
  label: string
}

export const MODELS_FILTER_TOGGLES: ModelsFilterToggle[] = [
  { key: 'withExistences', label: 'Con existencias' },
  { key: 'assigned', label: 'Con asignaciones' },
]
