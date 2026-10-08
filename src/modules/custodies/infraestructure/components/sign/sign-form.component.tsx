import { type ChangeEvent, type JSX, useCallback } from 'react'
import { SignatureIcon } from '@hugeicons/core-free-icons'
import {
  Button,
  FormField,
  Input,
  SignaturePad,
} from '../../../../shared/infraestructure/components/ui'
import type { ApiConflictDetail } from '../../../../shared/infraestructure/errors/api-conflict.model'
import { CustodyConflictNotice } from '../custody-conflict-notice.component'

interface Props {
  signerName: string
  signerNameError?: string
  signatureError?: string
  notice: ApiConflictDetail | null
  submitting: boolean
  canSubmit: boolean
  onSignerNameChange: (signerName: string) => void
  onSignatureChange: (image: string | null) => void
  onSubmit: () => void
  onCancel: () => void
}

const SIGNER_FIELD_ID = 'sign-signer-name'
const SIGNER_HELP = 'Aparece bajo la firma en la hoja PDF.'
const LEGEND =
  'Al firmar, el empleado acepta el contenido de la hoja y se genera el PDF definitivo.'

export function SignForm({
  signerName,
  signerNameError,
  signatureError,
  notice,
  submitting,
  canSubmit,
  onSignerNameChange,
  onSignatureChange,
  onSubmit,
  onCancel,
}: Props): JSX.Element {
  const handleSignerNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => onSignerNameChange(event.target.value),
    [onSignerNameChange],
  )

  return (
    <section className="flex flex-col gap-4 rounded-[18px] border border-hairline bg-white p-5 shadow-[0_1px_4px_rgba(14,15,60,0.04)]">
      <header>
        <h2 className="m-0 text-[14px] font-semibold text-ink">Firma del empleado</h2>
        <p className="m-0 mt-1 text-[12px] text-muted">{LEGEND}</p>
      </header>

      <FormField
        label="Nombre de quien firma"
        htmlFor={SIGNER_FIELD_ID}
        required
        helpText={SIGNER_HELP}
        error={signerNameError}
      >
        <Input
          id={SIGNER_FIELD_ID}
          value={signerName}
          maxLength={120}
          disabled={submitting}
          error={signerNameError !== undefined}
          autoComplete="off"
          onChange={handleSignerNameChange}
        />
      </FormField>

      <FormField label="Firma" required error={signatureError}>
        <SignaturePad
          disabled={submitting}
          invalid={signatureError !== undefined}
          onChange={onSignatureChange}
        />
      </FormField>

      {notice !== null && <CustodyConflictNotice detail={notice} />}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          icon={SignatureIcon}
          disabled={!canSubmit || submitting}
          onClick={onSubmit}
        >
          {submitting ? 'Firmando…' : 'Firmar y generar hoja'}
        </Button>
        <Button variant="ghost" disabled={submitting} onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </section>
  )
}
