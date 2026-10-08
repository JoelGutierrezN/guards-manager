import { type JSX, useCallback } from 'react'
import type { DashboardPendingSignature } from '../../domain/dashboard-pending-signature.model'
import { DashboardDateHelper } from '../helpers/dashboard-date.helper'
import { DashboardActivityChip } from './dashboard-activity-chip.component'

interface Props {
  signature: DashboardPendingSignature
  onSign: (signature: DashboardPendingSignature) => void
}

export function DashboardPendingRow({ signature, onSign }: Props): JSX.Element {
  const handleSign = useCallback(() => onSign(signature), [onSign, signature])

  return (
    <button
      type="button"
      onClick={handleSign}
      className="flex w-full cursor-pointer items-center gap-3 border-b border-hairline py-2.5 text-left transition-colors hover:bg-brand-soft"
    >
      <span className="w-20 shrink-0 font-mono text-[11px] text-muted">{signature.code}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-ink">
          {signature.employeeName}
        </span>
        <span className="block font-mono text-[11px] text-muted">
          {DashboardDateHelper.dateTime(signature.date)}
        </span>
      </span>
      <DashboardActivityChip type={signature.type} />
    </button>
  )
}
