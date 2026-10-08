import type { Brand } from '../domain/brand.entity'
import type { WindowManager } from '../../shared/domain/window-manager.model'

export type BrandsWindow = 'create' | 'edit' | 'delete' | 'merge'

export type BrandsWindowManager = WindowManager<BrandsWindow, Brand>
