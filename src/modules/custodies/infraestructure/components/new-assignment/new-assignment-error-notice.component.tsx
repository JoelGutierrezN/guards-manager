import { type JSX } from 'react'
import { Button } from '../../../../shared/infraestructure/components/ui'
import type { NewAssignmentErrorReport } from '../../../domain/new-assignment-error.model'

interface Props {
  error: NewAssignmentErrorReport
  onRetry?: () => void
}

export function NewAssignmentErrorNotice({ error, onRetry }: Props): JSX.Element {
  return (
    <div
      role="alert"
      className="rounded-[14px] border border-danger-soft bg-danger-soft px-4 py-3 text-[13px] text-danger"
    >
      <p className="m-0 font-semibold">{error.message}</p>
      {error.reasons.length > 0 && (
        <ul className="mt-1.5 mb-0 list-disc pl-4">
          {error.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      )}
      {onRetry && (
        <div className="mt-2.5">
          <Button size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      )}
    </div>
  )
}
