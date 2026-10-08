import { type JSX } from 'react'
import { Alert01Icon, RefreshIcon } from '@hugeicons/core-free-icons'
import { Button, Empty } from '../../../shared/infraestructure/components/ui'

interface Props {
  message: string
  onRetry: () => void
}

export function DashboardErrorNotice({ message, onRetry }: Props): JSX.Element {
  return (
    <div className="mt-6 rounded-[32px] border border-hairline bg-white">
      <Empty
        icon={Alert01Icon}
        title={message}
        body="Revisa tu conexión e inténtalo de nuevo."
        action={
          <Button variant="primary" icon={RefreshIcon} onClick={onRetry}>
            Reintentar
          </Button>
        }
      />
    </div>
  )
}
