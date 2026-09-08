import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import { CUSTODY_STATUS_MAP, type CustodyStatus } from '../../domain/custody-status.model'

interface Props {
  status: CustodyStatus
  size?: 'sm' | 'md'
}

export function CustodyStatusChip({ status, size = 'sm' }: Props): JSX.Element {
  const descriptor = CUSTODY_STATUS_MAP[status]

  return (
    <Chip tone={descriptor.tone} size={size} dot>
      {descriptor.label}
    </Chip>
  )
}
