import { type JSX } from 'react'
import { ArrowLeft01Icon, PackageDeliveredIcon } from '@hugeicons/core-free-icons'
import { Button } from '../../../../shared/infraestructure/components/ui'

interface Props {
  canSubmit: boolean
  isSubmitting: boolean
  helpMessage: string | null
  onBack: () => void
  onSubmit: () => void
}

export function ReturnFooter({
  canSubmit,
  isSubmitting,
  helpMessage,
  onBack,
  onSubmit,
}: Props): JSX.Element {
  return (
    <footer className="flex flex-wrap items-center gap-3 rounded-[18px] border border-hairline bg-white px-4 py-3">
      <Button variant="ghost" icon={ArrowLeft01Icon} disabled={isSubmitting} onClick={onBack}>
        Volver al resguardo
      </Button>
      {helpMessage !== null && <span className="text-[12px] text-muted">{helpMessage}</span>}
      <div className="ml-auto">
        <Button
          variant="primary"
          icon={PackageDeliveredIcon}
          disabled={!canSubmit || isSubmitting}
          onClick={onSubmit}
        >
          {isSubmitting ? 'Registrando…' : 'Registrar devolución'}
        </Button>
      </div>
    </footer>
  )
}
