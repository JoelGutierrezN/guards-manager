import { ItemConditionHelper } from '../../../shared/domain/item-condition.helper'
import type { ComboboxItem, SelectOption } from '../../../shared/infraestructure/components/ui'
import type {
  AssignmentProductOption,
  AssignmentStockProduct,
} from '../../domain/new-assignment-option.model'

const UNKNOWN_VALUE = 'Sin dato'

export class NewAssignmentOptionHelper {
  static assignableConditionOptions(): SelectOption[] {
    return ItemConditionHelper.assignable().map((descriptor) => ({
      value: descriptor.value,
      label: descriptor.label,
    }))
  }

  static productDescription(option: AssignmentProductOption): string {
    const parts = [option.brandName ?? UNKNOWN_VALUE, option.modelName ?? UNKNOWN_VALUE]
    if (option.available !== null) parts.push(`${option.available} disponibles`)
    return parts.join(' · ')
  }

  static toProductComboboxItem(option: AssignmentProductOption): ComboboxItem {
    return {
      value: option.id,
      label: option.name,
      description: NewAssignmentOptionHelper.productDescription(option),
    }
  }

  static stockProductDetails(product: AssignmentStockProduct): string {
    const details = [product.brandName, product.modelName].filter(
      (detail): detail is string => detail != null && detail !== '',
    )
    return details.length === 0 ? UNKNOWN_VALUE : details.join(' · ')
  }
}
