import { type ChangeEvent, type JSX, useCallback } from 'react'
import { FormField, Textarea } from '../../../../shared/infraestructure/components/ui'

interface Props {
  notes: string
  errorMessage?: string
  disabled: boolean
  onChange: (notes: string) => void
}

export function ReturnNotesField({ notes, errorMessage, disabled, onChange }: Props): JSX.Element {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value),
    [onChange],
  )

  return (
    <FormField
      label="Notas de la devolución"
      htmlFor="return-notes"
      helpText="Opcional. Se guarda junto a la devolución y aparece en la hoja."
      error={errorMessage}
    >
      <Textarea
        id="return-notes"
        value={notes}
        onChange={handleChange}
        placeholder="Estado general de las herramientas, observaciones…"
        maxLength={2000}
        disabled={disabled}
        error={errorMessage !== undefined}
      />
    </FormField>
  )
}
