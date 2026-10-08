import { ItemConditionHelper } from '../../../shared/domain/item-condition.helper'
import type { SelectOption } from '../../../shared/infraestructure/components/ui'

export class ReturnOptionHelper {
  /** Al devolver sí se aceptan las condiciones malas: son las que generan daños (D3). */
  static conditionOptions(): SelectOption[] {
    return ItemConditionHelper.all().map((descriptor) => ({
      value: descriptor.value,
      label: descriptor.label,
    }))
  }
}
