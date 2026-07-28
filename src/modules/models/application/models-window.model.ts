import type { ProductModel } from '../domain/product-model.entity'
import type { WindowManager } from '../../shared/domain/window-manager.model'

export type ModelsWindow = 'create' | 'edit' | 'deactivate' | 'delete'

export type ModelsWindowManager = WindowManager<ModelsWindow, ProductModel>
