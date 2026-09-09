import { type JSX } from 'react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Icon } from '../../../../shared/infraestructure/components/ui'

interface Props {
  message: string
  reasons: string[]
}

export function ReturnErrorNotice({ message, reasons }: Props): JSX.Element {
  return (
    <section
      role="alert"
      className="flex gap-2 rounded-[16px] border border-danger bg-danger-soft px-4 py-3"
    >
      <span className="mt-0.5 text-danger">
        <Icon icon={Alert02Icon} size={16} />
      </span>
      <div className="min-w-0">
        <p className="m-0 text-[13px] font-semibold text-danger">{message}</p>
        {reasons.length > 0 && (
          <ul className="m-0 mt-1 list-disc pl-4 text-[12px] text-ink-2">
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
