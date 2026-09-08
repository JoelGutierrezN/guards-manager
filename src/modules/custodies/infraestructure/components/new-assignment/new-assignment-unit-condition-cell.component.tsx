import { type JSX } from 'react'
import { ItemConditionHelper } from '../../../../shared/domain/item-condition.helper'
import type { ItemCondition } from '../../../../shared/domain/item-condition.model'
import { Chip } from '../../../../shared/infraestructure/components/ui'

interface Props {
  condition: ItemCondition
}

export function NewAssignmentUnitConditionCell({ condition }: Props): JSX.Element {
  return (
    <Chip tone={ItemConditionHelper.tone(condition)} size="sm">
      {ItemConditionHelper.label(condition)}
    </Chip>
  )
}
