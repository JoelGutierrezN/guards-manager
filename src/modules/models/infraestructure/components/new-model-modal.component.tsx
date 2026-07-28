import { type JSX, useMemo, useState } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Button, IconButton, Modal } from '../../../shared/infraestructure/components/ui'
import type { BrandSelectOption } from '../../../brands/domain/brand-select.model'
import type { ProductModel } from '../../domain/product-model.entity'
import type { CreateProductModelInput } from '../../domain/product-model-input.model'

interface Props {
  open: boolean
  brands: BrandSelectOption[]
  initialBrandId: string | null
  editModel: ProductModel | null
  saving: boolean
  formError: string | null
  onClose: () => void
  onSave: (input: CreateProductModelInput) => void
}

export function NewModelModal({
  open,
  brands,
  initialBrandId,
  editModel,
  saving,
  formError,
  onClose,
  onSave,
}: Props): JSX.Element {
  const isEdit = editModel != null
  const [brandId, setBrandId] = useState(() => editModel?.brandId ?? initialBrandId ?? '')
  const [name, setName] = useState(() => editModel?.name ?? '')

  const valid = brandId !== '' && name.trim().length > 0

  const selectClassName = useMemo(
    () =>
      `h-[42px] w-full rounded-[8px] border border-hairline-strong bg-white px-3 text-[14px] outline-none transition-[border-color,box-shadow] duration-[120ms] hover:border-ink-3 focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)] ${brandId !== '' ? 'text-ink' : 'text-muted-soft'}`,
    [brandId],
  )

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              {isEdit ? 'Editar registro' : 'Nuevo registro'}
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              {isEdit ? 'Editar modelo' : 'Crear nuevo modelo'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-ink-2">
              <span>
                Marca <span className="text-danger">*</span>
              </span>
            </label>
            <select
              value={brandId}
              onChange={(event) => setBrandId(event.target.value)}
              className={selectClassName}
            >
              <option value="">Selecciona marca…</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id} className="text-ink">
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center justify-between text-[12px] font-medium text-ink-2">
              <span>
                Código de modelo <span className="text-danger">*</span>
              </span>
              <span className="text-[11px] text-muted-soft">Ej. DCD996, M18 FUEL</span>
            </label>
            <div className="flex h-[42px] items-center rounded-full border border-hairline-strong bg-white px-4 transition-[border-color,box-shadow] duration-[120ms] focus-within:border-brand focus-within:shadow-[0_0_0_3px_var(--color-brand-soft)] hover:border-ink-3">
              <input
                className="h-full min-w-0 flex-1 border-none bg-transparent font-mono text-[14px] text-ink outline-none placeholder:text-muted-soft"
                placeholder="DCD996"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            {formError != null && <span className="text-[12px] text-danger">{formError}</span>}
          </div>
        </div>

        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!valid || saving}
            onClick={() => onSave({ name: name.trim(), brandId })}
          >
            {isEdit ? 'Guardar cambios' : 'Crear modelo'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
