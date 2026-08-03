import { type JSX, useState } from 'react'
import {
  Cancel01Icon,
  InformationCircleIcon,
  Book02Icon,
  Layers01Icon,
} from '@hugeicons/core-free-icons'
import { Modal, IconButton, Button, Icon } from '../../../shared/infraestructure/components/ui'
import { useToasts } from '../../../shared/infraestructure/components/ui'
import { MOCK_BRANDS, MOCK_MODELS } from '../mocks/catalog.mock'
import { Combobox } from './combobox.component'

interface NewToolData {
  name: string
  brand: string
  model: string
}

interface Props {
  open: boolean
  onClose: () => void
  onSave: (tool: NewToolData) => void
}

export function NewToolModal({ open, onClose, onSave }: Props): JSX.Element {
  const [toolName, setToolName] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [addToast, toastHost] = useToasts()

  const modelOptions = selectedBrand ? (MOCK_MODELS[selectedBrand] ?? []) : []
  const modelCountHint = selectedBrand
    ? `${modelOptions.length} en ${selectedBrand}`
    : 'elige marca'
  const isValid = toolName.trim().length > 2 && selectedBrand.length > 0 && selectedModel.length > 0

  const resetForm = () => {
    setToolName('')
    setSelectedBrand('')
    setSelectedModel('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand)
    setSelectedModel('')
  }

  const handleBrandCreate = (newBrand: string) => {
    // TODO API: POST /api/brands (crear marca) y refrescar el catálogo.
    setSelectedBrand(newBrand)
    setSelectedModel('')
    addToast(`Marca "${newBrand}" creada`)
  }

  const handleModelCreate = (newModel: string) => {
    // TODO API: POST /api/models (crear modelo para la marca seleccionada) y refrescar el catálogo.
    setSelectedModel(newModel)
    if (selectedBrand) addToast(`Modelo "${newModel}" creado en ${selectedBrand}`)
  }

  const handleSave = () => {
    if (isValid) {
      onSave({ name: toolName.trim(), brand: selectedBrand, model: selectedModel })
      resetForm()
    }
  }

  return (
    <Modal open={open} onClose={handleClose} maxWidth={480}>
      <div className="p-6" style={{ overflow: 'visible' }}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <div className="mb-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-brand">
              Catálogo · nueva
            </div>
            <div className="text-[20px] font-semibold leading-tight tracking-[-0.015em] text-ink">
              Nueva herramienta
            </div>
          </div>
          <IconButton icon={Cancel01Icon} onClick={handleClose} bordered size="sm" />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 flex items-center justify-between text-[12px] font-medium text-ink-2">
              <span>
                Marca <span className="text-danger">*</span>
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
                catálogo
              </span>
            </label>
            <Combobox
              value={selectedBrand}
              onChange={handleBrandChange}
              options={MOCK_BRANDS}
              placeholder="Selecciona marca…"
              leadIcon={Book02Icon}
              onCreateLabel="Crear marca"
              onCreate={handleBrandCreate}
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between text-[12px] font-medium text-ink-2">
              <span>
                Modelo <span className="text-danger">*</span>
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
                {modelCountHint}
              </span>
            </label>
            <Combobox
              value={selectedModel}
              onChange={setSelectedModel}
              options={modelOptions}
              placeholder={selectedBrand ? 'Selecciona modelo…' : '—'}
              leadIcon={Layers01Icon}
              onCreateLabel={selectedBrand ? `Crear modelo en ${selectedBrand}` : 'Crear modelo'}
              onCreate={selectedBrand ? handleModelCreate : null}
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center justify-between text-[12px] font-medium text-ink-2">
              <span>
                Nombre de la herramienta <span className="text-danger">*</span>
              </span>
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-muted">
                visible en asignaciones
              </span>
            </label>
            <input
              className="h-[42px] w-full rounded-full border border-hairline-strong bg-white px-4 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-brand focus:shadow-[0_0_0_3px_var(--color-brand-soft)] transition-[border-color,box-shadow]"
              placeholder="Ej. Taladro percutor 20V"
              value={toolName}
              onChange={(event) => setToolName(event.target.value)}
            />
          </div>

          <div className="flex items-start gap-3 rounded-[10px] border border-hairline bg-paper-tint p-2.5">
            <Icon icon={InformationCircleIcon} size={14} className="mt-0.5 shrink-0 text-brand" />
            <p className="text-[12px] text-muted">
              Se añade al catálogo y empieza <strong className="text-ink-2">sin inventario</strong>.
              Las piezas disponibles se registran en{' '}
              <strong className="text-ink-2">Ingreso de inventario</strong>.
            </p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" disabled={!isValid} onClick={handleSave}>
            Crear herramienta
          </Button>
        </div>

        {toastHost}
      </div>
    </Modal>
  )
}
