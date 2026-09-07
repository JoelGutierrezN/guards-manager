import { type JSX } from 'react'
import { PackageIcon, PlusSignIcon } from '@hugeicons/core-free-icons'
import {
  Button,
  Combobox,
  FormField,
  Skeleton,
  type ComboboxItem,
  type ComboboxOptionsLoader,
} from '../../../shared/infraestructure/components/ui'
import type { ProductOption } from '../../domain/product-option.model'
import { StockInProductCard } from './stock-in-product-card.component'

interface Props {
  product: ProductOption | null
  isLoading: boolean
  errorMessage?: string
  disabled: boolean
  loadOptions: ComboboxOptionsLoader
  onSelect: (item: ComboboxItem | null) => void
  onCreateProduct: () => void
}

const PRODUCT_FIELD_ID = 'stock-in-product'

export function StockInProductBlock({
  product,
  isLoading,
  errorMessage,
  disabled,
  loadOptions,
  onSelect,
  onCreateProduct,
}: Props): JSX.Element {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <Skeleton shape="text" width="120px" />
        <Skeleton shape="text" height="44px" />
      </div>
    )
  }

  return (
    <div>
      <FormField
        label="Producto"
        htmlFor={PRODUCT_FIELD_ID}
        helpText="Busca por nombre; se muestran marca, modelo y unidades disponibles."
        error={errorMessage}
        required
      >
        <Combobox
          id={PRODUCT_FIELD_ID}
          ariaLabel="Producto"
          value={product?.id ?? null}
          selectedLabel={product?.name ?? null}
          loadOptions={loadOptions}
          onChange={onSelect}
          onCreate={onCreateProduct}
          createLabel="Crear producto nuevo"
          placeholder="Buscar herramienta…"
          emptyMessage="Ninguna herramienta coincide con la búsqueda."
          leadIcon={PackageIcon}
          disabled={disabled}
          error={errorMessage !== undefined}
        />
      </FormField>

      {product && <StockInProductCard product={product} />}

      <div className="mt-3">
        <Button size="sm" icon={PlusSignIcon} onClick={onCreateProduct} disabled={disabled}>
          Crear producto nuevo
        </Button>
      </div>
    </div>
  )
}
