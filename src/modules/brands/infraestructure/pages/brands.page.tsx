import type { JSX } from 'react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button, PageHero, Pager, SearchInput, useToasts } from '../../../shared/infraestructure/components/ui'
import { BrandCard } from '../components/brand-card.component'
import { BrandCardSkeleton } from '../components/brand-card-skeleton.component'
import { NewBrandModal } from '../components/new-brand-modal.component'
import { useBrands } from '../../hooks/use-brands.hook'
import {CreateBrandCard} from "../components/create-brand-card.component.tsx";

interface Props {
  onSelectBrand?: (name: string) => void
}

export function BrandsPage({ onSelectBrand }: Props): JSX.Element {
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
    editingBrand,
    modalKey,
    modalOpen,
    closeModal,
  } = useBrands()
  const [addToast, ToastHost] = useToasts()

  const handleSave = async (name: string): Promise<void> => {
    addToast(await saveBrand(name))
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
                        onOpen={() => onSelectBrand?.(brand.name)}
                        onEdit={() => openEdit(brand)}
                    />
                ))
            }
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
        key={modalKey}
        open={modalOpen}
        editName={editingBrand?.name ?? null}
        onClose={closeModal}
        onSave={(name) => void handleSave(name)}
      />

      {ToastHost}
    </div>
  )
}
