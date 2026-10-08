import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import { CustodyDateHelper } from '../../application/custody-date.helper'

interface Props {
  signedAt: string | null
}

const PENDING_LABEL = 'Pendiente de firma'

export function CustodySignatureChip({ signedAt }: Props): JSX.Element {
  if (signedAt == null) {
    return (
      <Chip tone="warn" size="sm">
        {PENDING_LABEL}
      </Chip>
    )
  }

  return (
    <Chip tone="ok" size="sm">
      {CustodyDateHelper.date(signedAt)}
    </Chip>
  )
}
