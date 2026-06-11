import { type JSX, useState } from 'react'
import { BrandsPage } from './pages/brands.page'
import { BrandDetailPage } from './pages/brand-detail.page'

interface BrandsScreenProps {
  /** Navega a otra sección del shell (p. ej. "models"). */
  onNavigate?: (id: string) => void
}

/**
 * Sección de Marcas. Gestiona internamente la vista de catálogo y el detalle
 * de una marca (en el prototipo el detalle se abría con `location.hash`).
 */
export function BrandsScreen({ onNavigate }: BrandsScreenProps): JSX.Element {
  const [selected, setSelected] = useState<string | null>(null)

  if (selected) {
    return (
      <BrandDetailPage
        brandName={selected}
        onBack={() => setSelected(null)}
        onModels={() => onNavigate?.('models')}
      />
    )
  }

  return <BrandsPage onSelectBrand={setSelected} />
}
