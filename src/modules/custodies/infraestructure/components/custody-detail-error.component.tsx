import { type JSX } from 'react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { Button, Empty } from '../../../shared/infraestructure/components/ui'

interface Props {
  message: string | null
  notFound: boolean
  onRetry: () => void
  onBack: () => void
}

const FALLBACK_MESSAGE = 'No pudimos cargar el resguardo. Inténtalo de nuevo.'

export function CustodyDetailError({ message, notFound, onRetry, onBack }: Props): JSX.Element {
  return (
    <div className="reveal-d1 mx-auto w-full max-w-[720px] overflow-hidden rounded-[26px] border border-hairline bg-white shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
      <Empty
        icon={Alert02Icon}
        title={notFound ? 'Resguardo no encontrado' : 'Resguardo no disponible'}
        body={message ?? FALLBACK_MESSAGE}
        action={
          <div className="flex flex-wrap justify-center gap-2">
            {!notFound && <Button onClick={onRetry}>Reintentar</Button>}
            <Button variant="ghost" onClick={onBack}>
              Volver a Resguardos
            </Button>
          </div>
        }
      />
    </div>
  )
}
