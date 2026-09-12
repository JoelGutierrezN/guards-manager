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
import type { ProductModel } from '../../domain/product-model.entity'
import { ModelMergeOptionsHelper } from '../helpers/model-merge-options.helper'

interface Props {
  open: boolean
  model: ProductModel | null
  merging: boolean
  error: string | null
  onClose: () => void
  onConfirm: (targetId: string) => void
}

export function MergeModelModal({
  open,
  model,
  merging,
  error,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const [target, setTarget] = useState<ComboboxItem | null>(null)

  const loadTargetOptions = useCallback(
    (query: string): Promise<ComboboxItem[]> => {
      if (model == null) return Promise.resolve([])
      return ModelMergeOptionsHelper.loadTargets(model.brandId, model.id).then((items) =>
        items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase())),
      )
    },
    [model],
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
              Fusionar modelo
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              Fusionar {model != null ? `"${model.name}"` : 'el modelo'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={handleClose} bordered size="sm" />
        </div>

        <p className="mb-3 text-[13px] leading-relaxed text-ink-2">
          Las herramientas y resguardos de <b className="text-ink">{model?.name}</b> pasarán al
          modelo destino y este se eliminará. Elige un modelo de la misma marca, activo y distinto
          al actual.
        </p>

        <FormField label="Modelo destino" error={error ?? undefined}>
          <Combobox
            value={target?.value ?? null}
            selectedLabel={target?.label ?? null}
            onChange={setTarget}
            loadOptions={loadTargetOptions}
            placeholder="Busca el modelo destino…"
            emptyMessage="Sin modelos disponibles en esta marca"
            ariaLabel="Modelo destino"
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
