import { type ChangeEvent, type JSX, useCallback } from 'react'
import { Input } from '../../../../shared/infraestructure/components/ui'

interface Props {
  stockId: string
  consecutive: string
  notes: string
  required: boolean
  disabled: boolean
  hasError: boolean
  onChange: (stockId: string, notes: string) => void
}

export function ReturnItemNotesCell({
  stockId,
  consecutive,
  notes,
  required,
  disabled,
  hasError,
  onChange,
}: Props): JSX.Element {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => onChange(stockId, event.target.value),
    [onChange, stockId],
  )

  return (
    <Input
      value={notes}
      onChange={handleChange}
      placeholder={required ? 'Explica el daño (obligatorio)' : 'Nota de la unidad (opcional)'}
      aria-label={`Nota de ${consecutive}`}
      disabled={disabled}
      error={hasError}
      maxLength={2000}
    />
  )
}
