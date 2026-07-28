import { type JSX } from 'react'
import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { Button, IconButton, Modal } from '../../../shared/infraestructure/components/ui'
import type { BrandSelectOption } from '../../../brands/domain/brand-select.model'
import type { ProductModel } from '../../domain/product-model.entity'
import type { CreateProductModelInput } from '../../domain/product-model-input.model'
import { useNewModelForm } from '../../hooks/use-new-model-form.hook'
import { BrandStep } from './brand-step.component'
import { NameStep } from './name-step.component'

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
  const {
    state,
    filteredBrands,
    setBrandSearch,
    selectBrand,
    backToBrand,
    setName,
    setSimilarConfirmed,
    submit,
    canSave,
  } = useNewModelForm({ enabled: open, brands, initialBrandId, editModel, onSave })

  const isBrandStep = state.step === 'brand'
  const stepLabel = isBrandStep ? 'Paso 1 de 2 · Marca' : 'Paso 2 de 2 · Modelo'

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
              {isEdit ? 'Editar registro' : `Nuevo registro · ${stepLabel}`}
            </div>
            <div className="text-[20px] font-semibold tracking-[-0.015em] text-ink">
              {isEdit ? 'Editar modelo' : isBrandStep ? 'Selecciona la marca' : 'Crear nuevo modelo'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        {isBrandStep ? (
          <BrandStep
            search={state.brandSearch}
            brands={filteredBrands}
            onSearchChange={setBrandSearch}
            onSelect={selectBrand}
          />
        ) : (
          <NameStep
            brandName={state.brandName}
            brandDetail={state.brandDetail}
            brandDetailLoading={state.brandDetailLoading}
            name={state.name}
            checkStatus={state.checkStatus}
            duplicateModel={state.duplicateModel}
            similarModels={state.similarModels}
            similarConfirmed={state.similarConfirmed}
            formError={formError}
            onBack={backToBrand}
            onNameChange={setName}
            onSimilarConfirmedChange={setSimilarConfirmed}
          />
        )}

        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          {!isBrandStep && (
            <Button variant="primary" disabled={!canSave || saving} onClick={() => void submit()}>
              {isEdit ? 'Guardar cambios' : 'Crear modelo'}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
