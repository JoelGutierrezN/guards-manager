import { type JSX } from 'react'
import { ArrowLeft01Icon, ArrowRight01Icon, Task01Icon } from '@hugeicons/core-free-icons'
import { Button } from '../../../../shared/infraestructure/components/ui'
import type { NewAssignmentStepId } from '../../../application/new-assignment-state.model'

interface Props {
  stepId: NewAssignmentStepId
  canContinue: boolean
  canSubmit: boolean
  isSubmitting: boolean
  helpMessage: string | null
  onBack: () => void
  onContinue: () => void
  onSubmit: () => void
}

export function NewAssignmentFooter({
  stepId,
  canContinue,
  canSubmit,
  isSubmitting,
  helpMessage,
  onBack,
  onContinue,
  onSubmit,
}: Props): JSX.Element {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button
        icon={ArrowLeft01Icon}
        disabled={stepId === 'employee' || isSubmitting}
        onClick={onBack}
      >
        Atrás
      </Button>

      <div className="flex items-center gap-3">
        {helpMessage !== null && <p className="m-0 text-[12px] text-muted">{helpMessage}</p>}
        {stepId === 'confirm' ? (
          <Button
            variant="primary"
            size="lg"
            icon={Task01Icon}
            disabled={!canSubmit}
            onClick={onSubmit}
          >
            {isSubmitting ? 'Creando resguardo…' : 'Crear resguardo'}
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            iconRight={ArrowRight01Icon}
            disabled={!canContinue}
            onClick={onContinue}
          >
            Continuar
          </Button>
        )}
      </div>
    </div>
  )
}
