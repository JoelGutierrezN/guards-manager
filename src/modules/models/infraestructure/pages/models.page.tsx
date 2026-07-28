import { type JSX, useMemo, useState } from 'react'
import { Download04Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import {
  Button,
  Checkbox,
  Chip,
  Pager,
  PageHero,
  SearchInput,
  Tabs,
  useToasts,
} from '../../../shared/infraestructure/components/ui'
import type { CreateProductModelInput } from '../../domain/product-model-input.model'
import type { ProductModel } from '../../domain/product-model.entity'
import { useModelBrandTabs } from '../../hooks/use-model-brand-tabs.hook'
import { useProductModels } from '../../hooks/use-product-models.hook'
import { ALL_BRANDS_TAB } from '../../domain/brand-tabs.model'
import { BrandTabPicker } from '../components/brand-tab-picker.component'
import { NewModelModal } from '../components/new-model-modal.component'
import { DeactivateModelModal } from '../components/deactivate-model-modal.component'
import { DeleteModelModal } from '../components/delete-model-modal.component'
import { ModelRow } from '../components/model-row.component'
import { ModelRowSkeleton } from '../components/model-row-skeleton.component'
import {
  MODELS_TABLE_HEADER_HEIGHT_PX,
  MODELS_TABLE_ROW_HEIGHT_PX,
  MODELS_TABLE_TH,
} from '../components/models-table.model'

const TABLE_MAX_HEIGHT_PX = 600

export function ModelsPage(): JSX.Element {
  const { brands, tabItems, hiddenBrands, hasOverflow, selectedBrandId, selectBrand, refresh } =
    useModelBrandTabs()
  const brandId = selectedBrandId === ALL_BRANDS_TAB ? null : selectedBrandId
  const {
    state,
    showSkeletons,
    skeletonSlots,
    reload,
    setPage,
    setQuery,
    openCreate,
    openEdit,
    saveModel,
    deactivateModel,
    confirmDeactivate,
    reactivateModel,
    openDelete,
    confirmDelete,
    editingModel,
    deactivatingModel,
    deletingModel,
    modalKey,
    modalOpen,
    deactivateModalOpen,
    deleteModalOpen,
    closeModal,
  } = useProductModels(brandId, refresh)
  const [addToast, ToastHost] = useToasts()
  const [showInactiveFilter, setShowInactiveFilter] = useState(false)

  const handleSave = async (input: CreateProductModelInput): Promise<void> => {
    const message = await saveModel(input)
    if (message != null) addToast(message)
  }

  const handleDeactivate = async (model: ProductModel): Promise<void> => {
    const message = await deactivateModel(model)
    if (message != null) addToast(message)
  }

  const handleConfirmDeactivate = async (): Promise<void> => {
    const message = await confirmDeactivate()
    if (message != null) addToast(message)
  }

  const handleReactivate = async (model: ProductModel): Promise<void> => {
    addToast(await reactivateModel(model))
  }

  const handleConfirmDelete = async (): Promise<void> => {
    const message = await confirmDelete()
    if (message != null) addToast(message)
  }

  const { modelsTotal, brandsTotal, stocksTotal } = state
  const isEmpty = !showSkeletons && state.status === 'ready' && state.models.length === 0
  const emptyMessage =
    state.query !== ''
      ? `Sin resultados para «${state.query}».`
      : 'Aún no hay modelos registrados.'

  const tableAreaStyle = useMemo(
    () => ({
      minHeight: Math.min(
        TABLE_MAX_HEIGHT_PX,
        MODELS_TABLE_HEADER_HEIGHT_PX + state.perPage * MODELS_TABLE_ROW_HEIGHT_PX,
      ),
    }),
    [state.perPage],
  )

  return (
    <div className="mx-auto w-full max-w-370">
      <PageHero
        eyebrow="Catálogos · modelos"
        title="Modelos de herramientas"
        italic="de herramientas"
        lede={`${modelsTotal} modelos en ${brandsTotal} marcas · ${stocksTotal} herramientas activas.`}
        actions={
          <>
            <span className="relative inline-flex">
              <Button icon={Download04Icon} disabled>
                Exportar
              </Button>
              <span className="absolute -top-2 -right-2">
                <Chip tone="navy" size="sm">
                  En desarrollo
                </Chip>
              </span>
            </span>
            <Button variant="primary" icon={PlusSignIcon} onClick={openCreate}>
              Nuevo modelo
            </Button>
          </>
        }
      />

      <div className="reveal-d2 mb-3 flex items-end border-b border-hairline">
        <Tabs value={selectedBrandId} onChange={selectBrand} items={tabItems} />
        {hasOverflow && <BrandTabPicker brands={hiddenBrands} onSelect={selectBrand} />}
      </div>

      <div className="reveal-d3 overflow-hidden rounded-[20px] border border-hairline bg-white shadow-[0_1px_2px_rgba(14,15,60,0.04)]">
        <div className="flex items-center gap-2 border-b border-hairline px-3 py-3">
          <SearchInput
            value={state.query}
            onChange={setQuery}
            placeholder="Buscar por nombre de modelo…"
            ariaLabel="Buscar modelo"
            className="h-8 max-w-[320px] flex-1"
          />
          <div className="flex items-center gap-1.5">
            <Checkbox
              label="Ver dados de baja"
              checked={showInactiveFilter}
              onChange={(event) => setShowInactiveFilter(event.target.checked)}
            />
            <Chip tone="navy" size="sm">
              En desarrollo
            </Chip>
          </div>
          <span className="ml-auto text-[13px] text-muted">
            Mostrando <b className="text-ink">{state.total}</b> modelos
          </span>
        </div>

        <div className="max-h-150 overflow-y-auto" style={tableAreaStyle}>
          {state.status === 'error' ? (
            <div className="flex h-full min-h-[inherit] flex-col items-center justify-center gap-3">
              <span className="text-[13px] text-muted">{state.error}</span>
              <Button onClick={reload}>Reintentar</Button>
            </div>
          ) : (
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr>
                  <th className={MODELS_TABLE_TH}>Marca</th>
                  <th className={MODELS_TABLE_TH}>Nombre del modelo</th>
                  <th className={MODELS_TABLE_TH}>Existencias</th>
                  <th className={MODELS_TABLE_TH}>Uso</th>
                  <th className={`${MODELS_TABLE_TH} w-37.5`} />
                </tr>
              </thead>
              <tbody>
                {showSkeletons && skeletonSlots.map((slot) => <ModelRowSkeleton key={slot} />)}
                {!showSkeletons &&
                  state.models.map((model) => (
                    <ModelRow
                      key={model.id}
                      model={model}
                      pending={state.pendingId === model.id}
                      onEdit={() => openEdit(model)}
                      onDeactivate={() => void handleDeactivate(model)}
                      onReactivate={() => void handleReactivate(model)}
                      onDelete={() => openDelete(model)}
                    />
                  ))}
                {isEmpty && (
                  <tr>
                    <td colSpan={5} className="px-3 py-16 text-center text-[13px] text-muted">
                      {emptyMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="min-h-12 border-t border-hairline px-4 pb-3 text-[13px] text-muted">
          <Pager
            page={state.page}
            lastPage={state.lastPage}
            total={state.total}
            onChange={setPage}
            itemsLabel="modelos"
          />
        </div>
      </div>

      <NewModelModal
        key={modalKey}
        open={modalOpen}
        brands={brands}
        initialBrandId={brandId}
        editModel={editingModel}
        saving={state.saving}
        formError={state.formError}
        onClose={closeModal}
        onSave={(input) => void handleSave(input)}
      />

      <DeactivateModelModal
        open={deactivateModalOpen}
        model={deactivatingModel}
        onClose={closeModal}
        onConfirm={() => void handleConfirmDeactivate()}
      />

      <DeleteModelModal
        open={deleteModalOpen}
        model={deletingModel}
        onClose={closeModal}
        onConfirm={() => void handleConfirmDelete()}
      />

      {ToastHost}
    </div>
  )
}
