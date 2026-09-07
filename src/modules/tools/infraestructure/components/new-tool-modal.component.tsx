import { type JSX, useMemo } from 'react'
import {
  Alert02Icon,
  Book02Icon,
  Cancel01Icon,
  InformationCircleIcon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { Spinner } from '@heroui/react'
import {
  Button,
  Combobox,
  FormField,
  Icon,
  IconButton,
  Input,
  Modal,
} from '../../../shared/infraestructure/components/ui'
import type { Tool } from '../../domain/tool.entity'
import type { ToolFormSubmit } from '../../application/tool-form.model'
import { useToolForm } from '../../hooks/use-tool-form.hook'

interface Props {
  open: boolean
  tool: Tool | null
  onClose: () => void
  onSubmit: ToolFormSubmit
  onNotifyError: (message: string) => void
}

export function NewToolModal({ open, tool, onClose, onSubmit, onNotifyError }: Props): JSX.Element {
  const {
    state,
    visibleErrors,
    canSave,
    setName,
    selectBrand,
    selectProductModel,
    loadBrandOptions,
    loadProductModelOptions,
    createBrand,
    createProductModel,
    submit,
  } = useToolForm({ tool, onSubmit, onNotifyError })

  const isEditing = tool !== null
  const isPrefilling = state.prefillStatus === 'loading'

  const modelCreateLabel = useMemo(
    () => (state.brandName !== '' ? `Crear modelo en ${state.brandName}` : 'Crear modelo'),
    [state.brandName],
  )

  return (
    <Modal open={open} onClose={onClose} maxWidth={480}>
      <div className="p-6" style={{ overflow: 'visible' }}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-brand">
              {isEditing ? 'Catálogo · edición' : 'Catálogo · nueva'}
            </div>
            <div className="text-[20px] font-semibold leading-tight tracking-[-0.015em] text-ink">
              {isEditing ? 'Editar herramienta' : 'Nueva herramienta'}
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={onClose} bordered size="sm" />
        </div>

        <div className="flex flex-col gap-4">
          {state.prefillStatus === 'error' && (
            <div className="flex items-start gap-3 rounded-[10px] border border-danger-soft bg-danger-soft p-2.5">
              <Icon icon={Alert02Icon} size={14} className="mt-0.5 shrink-0 text-danger" />
              <p className="text-[12px] text-danger">
                No se pudo recuperar la marca y el modelo actuales. Vuelve a seleccionarlos antes de
                guardar.
              </p>
            </div>
          )}

          <FormField label="Marca" hint="catálogo" required error={visibleErrors.brandId}>
            <Combobox
              value={state.brandId === '' ? null : state.brandId}
              selectedLabel={state.brandName}
              onChange={selectBrand}
              loadOptions={loadBrandOptions}
              placeholder="Selecciona marca…"
              emptyMessage="Sin marcas que coincidan"
              leadIcon={Book02Icon}
              createLabel="Crear marca"
              onCreate={createBrand}
              ariaLabel="Marca"
              disabled={isPrefilling}
              error={visibleErrors.brandId !== undefined}
            />
          </FormField>

          <FormField
            label="Modelo"
            hint={state.brandName !== '' ? state.brandName : 'elige marca'}
            required
            error={visibleErrors.productModelId}
          >
            <Combobox
              value={state.productModelId === '' ? null : state.productModelId}
              selectedLabel={state.productModelName}
              onChange={selectProductModel}
              loadOptions={loadProductModelOptions}
              placeholder={state.brandId !== '' ? 'Busca un modelo…' : '—'}
              emptyMessage="Sin modelos que coincidan"
              leadIcon={Layers01Icon}
              createLabel={modelCreateLabel}
              onCreate={state.brandId !== '' ? createProductModel : undefined}
              ariaLabel="Modelo"
              disabled={isPrefilling || state.brandId === ''}
              error={visibleErrors.productModelId !== undefined}
            />
          </FormField>

          <FormField
            label="Nombre de la herramienta"
            hint="visible en asignaciones"
            required
            error={visibleErrors.name}
          >
            <Input
              lg
              placeholder="Ej. Taladro percutor 20V"
              value={state.name}
              aria-label="Nombre de la herramienta"
              error={visibleErrors.name !== undefined}
              disabled={isPrefilling}
              onChange={(event) => setName(event.target.value)}
            />
          </FormField>

          {state.apiMessage !== null && (
            <p className="text-[12px] text-danger" role="alert">
              {state.apiMessage}
            </p>
          )}

          {!isEditing && (
            <div className="flex items-start gap-3 rounded-[10px] border border-hairline bg-paper-tint p-2.5">
              <Icon icon={InformationCircleIcon} size={14} className="mt-0.5 shrink-0 text-brand" />
              <p className="text-[12px] text-muted">
                Se añade al catálogo y empieza{' '}
                <strong className="text-ink-2">sin inventario</strong>. Las piezas disponibles se
                registran en <strong className="text-ink-2">Ingreso de inventario</strong>.
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={state.isSaving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            disabled={!canSave || isPrefilling}
            onClick={() => void submit()}
          >
            {state.isSaving && <Spinner size="sm" color="current" />}
            {isEditing ? 'Guardar cambios' : 'Crear herramienta'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
