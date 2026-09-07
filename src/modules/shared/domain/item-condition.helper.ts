import {
  BAD_CONDITIONS,
  ITEM_CONDITION_MAP,
  ITEM_CONDITIONS,
  type ItemCondition,
  type ItemConditionDescriptor,
  type ItemConditionTone,
} from './item-condition.model'

export class ItemConditionHelper {
  static isBad(condition: ItemCondition): boolean {
    return BAD_CONDITIONS.includes(condition)
  }

  static label(condition: ItemCondition): string {
    return ITEM_CONDITION_MAP[condition].label
  }

  static tone(condition: ItemCondition): ItemConditionTone {
    return ITEM_CONDITION_MAP[condition].tone
  }

  static all(): ItemConditionDescriptor[] {
    return ITEM_CONDITIONS.map((condition) => ITEM_CONDITION_MAP[condition])
  }

  static assignable(): ItemConditionDescriptor[] {
    return ItemConditionHelper.all().filter(
      (descriptor) => !ItemConditionHelper.isBad(descriptor.value),
    )
  }

  static isItemCondition(candidate: string): candidate is ItemCondition {
    return Object.hasOwn(ITEM_CONDITION_MAP, candidate)
  }
}
