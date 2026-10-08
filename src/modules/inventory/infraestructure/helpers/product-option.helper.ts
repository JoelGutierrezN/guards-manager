import type { ComboboxItem } from '../../../shared/infraestructure/components/ui'
import type { ProductOption } from '../../domain/product-option.model'

const UNKNOWN_VALUE = 'Sin dato'

export class ProductOptionHelper {
  static describe(option: ProductOption): string {
    const parts = [option.brandName ?? UNKNOWN_VALUE, option.modelName ?? UNKNOWN_VALUE]
    if (option.available !== null) parts.push(`${option.available} disponibles`)
    return parts.join(' · ')
  }

  static toComboboxItem(option: ProductOption): ComboboxItem {
    return {
      value: option.id,
      label: option.name,
      description: ProductOptionHelper.describe(option),
    }
  }
}
