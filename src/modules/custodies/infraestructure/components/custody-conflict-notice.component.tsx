import { type JSX } from 'react'
import type { ApiConflictDetail } from '../../../shared/infraestructure/errors/api-conflict.model'

interface Props {
  detail: ApiConflictDetail
}

export function CustodyConflictNotice({ detail }: Props): JSX.Element {
  return (
    <div className="mt-3 rounded-[12px] border border-danger-soft bg-danger-soft px-3 py-2.5">
      <p className="text-[12px] font-semibold text-danger">{detail.message}</p>
      {detail.reasons.length > 0 && (
        <ul className="mt-1 list-disc pl-4 text-[12px] text-danger">
          {detail.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
