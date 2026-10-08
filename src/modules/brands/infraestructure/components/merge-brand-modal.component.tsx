import { type JSX, useCallback, useState } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import {
  Button,
  Combobox,
  type ComboboxItem,
  FormField,
  IconButton,
  Modal,
} from '../../../shared/infraestructure/components/ui'
import type { Brand } from '../../domain/brand.entity'
import { BrandMergeOptionsHelper } from '../helpers/brand-merge-options.helper'

interface Props {
  open: boolean
  brand: Brand | null
  merging: boolean
  error: string | null
  onClose: () => void
  onConfirm: (targetId: string) => void
}

export function MergeBrandModal({
  open,
  brand,
  merging,
  error,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const [target, setTarget] = useState<ComboboxItem | null>(null)

  const loadTargetOptions = useCallback(
    (query: string): Promise<ComboboxItem[]> => {
      if (brand == null) return Promise.resolve([])
      return BrandMergeOptionsHelper.loadTargets(query, brand.id)
    },
    [brand],
  )

  const handleClose = useCallback(() => {
    setTarget(null)
    onClose()
  }, [onClose])

  const handleConfirm = useCallback(() => {
    if (target == null) return
    onConfirm(target.value)
  }, [target, onConfirm])

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              Fusionar marca
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Fusionar {brand != null ? `"${brand.name}"` : 'la marca'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={handleClose} bordered size="sm" />
        </div>

        <p className="mb-3 text-[13px] leading-relaxed text-ink-2">
          Los modelos y herramientas de <b className="text-ink">{brand?.name}</b> pasarán a la marca
          destino y esta se eliminará. Elige una marca distinta a la actual.
        </p>

        <FormField label="Marca destino" error={error ?? undefined}>
          <Combobox
            value={target?.value ?? null}
            selectedLabel={target?.label ?? null}
            onChange={setTarget}
            loadOptions={loadTargetOptions}
            placeholder="Busca la marca destino…"
            emptyMessage="Sin marcas disponibles"
            ariaLabel="Marca destino"
          />
        </FormField>

        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose} disabled={merging}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={merging || target == null}>
            Fusionar
          </Button>
        </div>
      </div>
    </Modal>
  )
}
