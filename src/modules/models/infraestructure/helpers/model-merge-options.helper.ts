import type { ComboboxItem } from '../../../shared/infraestructure/components/ui'
import { productModelRepository } from '../repositories/product-model.repository'
import type { ProductModel } from '../../domain/product-model.entity'

/** `GET /product-models` topa en 10 resultados (D5): la búsqueda va al API, nunca en memoria. */
const PAGE_LIMIT = '10'

export class ModelMergeOptionsHelper {
  static async loadTargets(
    brandId: string,
    excludeModelId: string,
    query: string,
  ): Promise<ComboboxItem[]> {
    const page = await productModelRepository.list(
      ModelMergeOptionsHelper.buildParams(brandId, query),
    )
    return page.models
      .filter((model) => model.id !== excludeModelId)
      .map((model) => ModelMergeOptionsHelper.toItem(model))
  }

  private static buildParams(brandId: string, name: string): URLSearchParams {
    const params = new URLSearchParams({ page: '1', brand_id: brandId, limit: PAGE_LIMIT })
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
