import { type JSX } from 'react'
import { Button } from '../../../../shared/infraestructure/components/ui'

interface Props {
  message: string
  reasons?: string[]
  onRetry?: () => void
}

/** Aviso de error del wizard: lo comparten el paso de unidades y el envío del resguardo. */
export function NewAssignmentErrorNotice({ message, reasons = [], onRetry }: Props): JSX.Element {
  return (
    <div
      role="alert"
      className="rounded-[14px] border border-danger-soft bg-danger-soft px-4 py-3 text-[13px] text-danger"
    >
      <p className="m-0 font-semibold">{message}</p>
      {reasons.length > 0 && (
        <ul className="mt-1.5 mb-0 list-disc pl-4">
          {reasons.map((reason) => (
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
