import type { ComboboxItem } from '../../../shared/infraestructure/components/ui'
import { productModelRepository } from '../repositories/product-model.repository'
import type { ProductModel } from '../../domain/product-model.entity'

export class ModelMergeOptionsHelper {
  static async loadTargets(brandId: string, excludeModelId: string): Promise<ComboboxItem[]> {
    const page = await productModelRepository.list(ModelMergeOptionsHelper.buildParams(brandId, ''))
    return page.models
      .filter((model) => model.id !== excludeModelId)
      .map((model) => ModelMergeOptionsHelper.toItem(model))
  }

  private static buildParams(brandId: string, name: string): URLSearchParams {
    const params = new URLSearchParams({ page: '1', brand_id: brandId })
    if (name.trim() !== '') params.set('name', name.trim())
    return params
  }

  private static toItem(model: ProductModel): ComboboxItem {
    return {
      value: model.id,
      label: model.name,
      description: model.active ? undefined : 'Dado de baja',
      disabled: !model.active,
    }
  }
}
