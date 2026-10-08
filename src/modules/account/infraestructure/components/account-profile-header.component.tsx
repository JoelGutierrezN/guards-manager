import { type JSX } from 'react'
import { Avatar } from '../../../shared/infraestructure/components/ui'
import type { AccountProfile } from '../../domain/account-profile.model'

interface Props {
  profile: AccountProfile
}

export function AccountProfileHeader({ profile }: Props): JSX.Element {
  return (
    <div className="flex items-center gap-4">
      <Avatar name={profile.name} size="xl" tone="navy" />
      <div className="min-w-0">
        <div className="truncate text-[20px] font-semibold tracking-[-0.015em] text-ink">
          {profile.name}
        </div>
        <div className="truncate font-mono text-[12px] text-muted">@{profile.username}</div>
      </div>
    </div>
  )
}
