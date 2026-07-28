import { type JSX, useMemo } from 'react'
import { Download04Icon, PlusSignIcon } from '@hugeicons/core-free-icons'
import {
  Button,
  Checkbox,
  Pager,
  PageHero,
  SearchInput,
  Tabs,
  useToasts,
} from '../../../shared/infraestructure/components/ui'
import type { CreateProductModelInput } from '../../domain/product-model-input.model'
import { useModelBrandTabs } from '../../hooks/use-model-brand-tabs.hook'
import { useProductModels } from '../../hooks/use-product-models.hook'
import { ALL_BRANDS_TAB } from '../../domain/brand-tabs.model'
import { BrandTabPicker } from '../components/brand-tab-picker.component'
import { NewModelModal } from '../components/new-model-modal.component'
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
    editingModel,
    modalKey,
    modalOpen,
    closeModal,
  } = useProductModels(brandId, refresh)
  const [addToast, ToastHost] = useToasts()

  const handleSave = async (input: CreateProductModelInput): Promise<void> => {
    const message = await saveModel(input)
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
            <Button icon={Download04Icon} onClick={() => addToast('Exportando catálogo de modelos…')}>
              Exportar
            </Button>
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
            placeholder="Buscar por código…"
            ariaLabel="Buscar modelo"
            className="h-8 max-w-[320px] flex-1"
          />
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
                  <th className={`${MODELS_TABLE_TH} w-8`}>
                    <Checkbox />
                  </th>
                  <th className={MODELS_TABLE_TH}>Marca</th>
                  <th className={MODELS_TABLE_TH}>Código</th>
                  <th className={MODELS_TABLE_TH}>Herram.</th>
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
                      onEdit={() => openEdit(model)}
                      onDelete={() => undefined}
                    />
                  ))}
                {isEmpty && (
                  <tr>
                    <td colSpan={6} className="px-3 py-16 text-center text-[13px] text-muted">
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

      {ToastHost}
    </div>
  )
}
