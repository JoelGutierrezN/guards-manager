import type { JSX } from 'react'
import { useNavigate } from 'react-router'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import {
  Button,
  PageHero,
  Pager,
  SearchInput,
  useToasts,
} from '../../../shared/infraestructure/components/ui'
import { BrandCard } from '../components/brand-card.component'
import { BrandCardSkeleton } from '../components/brand-card-skeleton.component'
import { NewBrandModal } from '../components/new-brand-modal.component'
import { DeleteBrandModal } from '../components/delete-brand-modal.component'
import { MergeBrandModal } from '../components/merge-brand-modal.component'
import { useBrands } from '../../hooks/use-brands.hook'
import { CreateBrandCard } from '../components/create-brand-card.component.tsx'

export function BrandsPage(): JSX.Element {
  const navigate = useNavigate()
  const {
    state,
    showSkeletons,
    skeletonSlots,
    reload,
    setPage,
    setQuery,
    openCreate,
    openEdit,
    saveBrand,
    openDelete,
    confirmDelete,
    openMerge,
    mergeBrand,
    editingBrand,
    deletingBrand,
    mergingBrand,
    modalKey,
    modalOpen,
    deleteModalOpen,
    mergeModalOpen,
    closeModal,
  } = useBrands()
  const [addToast, ToastHost] = useToasts()

  const handleSave = async (name: string): Promise<void> => {
    addToast(await saveBrand(name))
  }

  const handleConfirmDelete = async (): Promise<void> => {
    const result = await confirmDelete()
    if (result != null) addToast(result.message, result.succeeded ? 'success' : 'error')
  }

  const handleMerge = async (targetId: string): Promise<void> => {
    const result = await mergeBrand(targetId)
    if (result != null) addToast(result.message, result.succeeded ? 'success' : 'error')
  }

  return (
    <div className="mx-auto w-full max-w-370">
      <PageHero
        eyebrow="Catálogos · marcas"
        title="Marcas de herramientas"
        italic="de herramientas"
        lede={`${state.total} marcas registradas. ${state.modelsTotal} modelos y ${state.toolsTotal} herramientas activas en inventario.`}
        actions={
          <>
            <SearchInput
              value={state.query}
              onChange={setQuery}
              placeholder="Buscar marca…"
              ariaLabel="Buscar marca"
            />
            <Button variant="primary" icon={PlusSignIcon} onClick={openCreate}>
              Nueva marca
            </Button>
          </>
        }
      />

      {state.status === 'error' && (
        <div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-[26px] border border-hairline bg-white">
          <span className="text-[13px] text-muted">{state.error}</span>
          <Button onClick={reload}>Reintentar</Button>
        </div>
      )}

      {state.status !== 'error' && (
        <div className="lg:min-h-160 flex flex-col justify-between">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-full">
            <CreateBrandCard openCreate={openCreate} />

            {showSkeletons
              ? skeletonSlots.map((index) => <BrandCardSkeleton key={index} />)
              : state.brands.map((brand) => (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    onOpen={() => void navigate(`/models?brand=${encodeURIComponent(brand.id)}`)}
                    onEdit={() => openEdit(brand)}
                    onDelete={() => openDelete(brand)}
                    onMerge={() => openMerge(brand)}
                  />
                ))}
          </div>

          {!showSkeletons && state.brands.length === 0 && state.query !== '' && (
            <div className="mt-3 text-center text-[13px] text-muted">
              Sin resultados para “{state.query}”.
            </div>
          )}

          <Pager
            page={state.page}
            lastPage={state.lastPage}
            total={state.total}
            onChange={setPage}
            itemsLabel="marcas"
          />
        </div>
      )}

      <NewBrandModal
        key={`form-${modalKey}`}
        open={modalOpen}
        editName={editingBrand?.name ?? null}
        onClose={closeModal}
        onSave={(name) => void handleSave(name)}
      />

      <DeleteBrandModal
        open={deleteModalOpen}
        brand={deletingBrand}
        preview={state.deletionPreview}
        previewStatus={state.deletionPreviewStatus}
        deleting={state.deleting}
        error={state.deleteError}
        onClose={closeModal}
        onConfirm={() => void handleConfirmDelete()}
      />

      {/* `modalKey` remonta el modal en cada apertura: el destino elegido antes no sobrevive. */}
      <MergeBrandModal
        key={`merge-${modalKey}`}
        open={mergeModalOpen}
        brand={mergingBrand}
        merging={state.merging}
        error={state.mergeError}
        onClose={closeModal}
        onConfirm={(targetId) => void handleMerge(targetId)}
      />

      {ToastHost}
    </div>
  )
}
