import { type JSX } from 'react'
import { Chip } from '../../../shared/infraestructure/components/ui'
import { CustodyDateHelper } from '../../application/custody-date.helper'

interface Props {
  signedAt: string | null
}

export function CustodySignatureChip({ signedAt }: Props): JSX.Element {
  if (signedAt == null) return <Chip size="sm">Pendiente</Chip>

  return (
    <Chip tone="ok" size="sm">
      {CustodyDateHelper.date(signedAt)}
    </Chip>
  )
}
